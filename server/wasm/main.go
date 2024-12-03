//go:build js && wasm

package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"syscall/js"
)

//go:embed data.json
var dataFS embed.FS

type StockRecord struct {
	Ticker     string  `json:"ticker"`
	DateKey    int32   `json:"date_key"`
	StockOpen  float64 `json:"stock_open"`
	StockHigh  float64 `json:"stock_high"`
	StockLow   float64 `json:"stock_low"`
	StockClose float64 `json:"stock_close"`
	Volume     int64   `json:"volume"`
}

type OHLCData struct {
	Period string  `json:"period"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume int64   `json:"volume"`
	VWAP   float64 `json:"vwap"`
}

type OHLCResponse struct {
	Ticker string     `json:"ticker"`
	Year   int        `json:"year"`
	Window string     `json:"window"`
	Data   []OHLCData `json:"data"`
}

type DailyData struct {
	Date   string  `json:"date"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume int64   `json:"volume"`
}

type DailyResponse struct {
	Ticker string      `json:"ticker"`
	Year   int         `json:"year"`
	Month  int         `json:"month"`
	Data   []DailyData `json:"data"`
}

var stockData []StockRecord

func loadData() error {
	data, err := dataFS.ReadFile("data.json")
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &stockData)
}

func getTickers() []string {
	tickerSet := make(map[string]bool)
	for _, record := range stockData {
		tickerSet[record.Ticker] = true
	}

	tickers := make([]string, 0, len(tickerSet))
	for ticker := range tickerSet {
		tickers = append(tickers, ticker)
	}
	sort.Strings(tickers)
	return tickers
}

func calculateOHLC(ticker string, year int, window string) OHLCResponse {
	type periodData struct {
		firstDateKey     int32
		lastDateKey      int32
		open             float64
		high             float64
		low              float64
		close            float64
		volume           int64
		totalPriceVolume float64
	}

	periods := make(map[int]*periodData)
	ticker = strings.ToUpper(ticker)

	for _, record := range stockData {
		if record.Ticker != ticker {
			continue
		}

		recordYear := int(record.DateKey) / 10000
		if recordYear != year {
			continue
		}

		periodKey := (int(record.DateKey) % 10000) / 100

		if periods[periodKey] == nil {
			periods[periodKey] = &periodData{
				firstDateKey: record.DateKey,
				lastDateKey:  record.DateKey,
				open:         record.StockOpen,
				high:         record.StockHigh,
				low:          record.StockLow,
				close:        record.StockClose,
			}
		}

		pd := periods[periodKey]

		if record.DateKey < pd.firstDateKey {
			pd.firstDateKey = record.DateKey
			pd.open = record.StockOpen
		}

		if record.DateKey > pd.lastDateKey {
			pd.lastDateKey = record.DateKey
			pd.close = record.StockClose
		}

		if record.StockHigh > pd.high {
			pd.high = record.StockHigh
		}
		if record.StockLow < pd.low {
			pd.low = record.StockLow
		}

		pd.volume += record.Volume
		typicalPrice := (record.StockHigh + record.StockLow + record.StockClose) / 3
		pd.totalPriceVolume += typicalPrice * float64(record.Volume)
	}

	response := OHLCResponse{
		Ticker: ticker,
		Year:   year,
		Window: window,
		Data:   []OHLCData{},
	}

	periodKeys := make([]int, 0, len(periods))
	for k := range periods {
		periodKeys = append(periodKeys, k)
	}
	sort.Ints(periodKeys)

	monthNames := []string{"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}

	for _, periodKey := range periodKeys {
		pd := periods[periodKey]
		vwap := 0.0
		if pd.volume > 0 {
			vwap = pd.totalPriceVolume / float64(pd.volume)
		}

		response.Data = append(response.Data, OHLCData{
			Period: monthNames[periodKey],
			Open:   pd.open,
			High:   pd.high,
			Low:    pd.low,
			Close:  pd.close,
			Volume: pd.volume,
			VWAP:   vwap,
		})
	}

	return response
}

func getDates() []int {
	dateSet := make(map[int]bool)
	for _, record := range stockData {
		dateSet[int(record.DateKey)] = true
	}

	dates := make([]int, 0, len(dateSet))
	for date := range dateSet {
		dates = append(dates, date)
	}
	sort.Ints(dates)
	return dates
}

func getTickerDataForDate(ticker string, dateKey int) *StockRecord {
	ticker = strings.ToUpper(ticker)
	for _, record := range stockData {
		if record.Ticker == ticker && int(record.DateKey) == dateKey {
			return &record
		}
	}
	return nil
}

func getTickersJS(this js.Value, args []js.Value) interface{} {
	tickers := getTickers()
	result := map[string][]string{"tickers": tickers}
	jsonBytes, _ := json.Marshal(result)
	return string(jsonBytes)
}

func getDatesJS(this js.Value, args []js.Value) interface{} {
	dates := getDates()
	result := map[string][]int{"dates": dates}
	jsonBytes, _ := json.Marshal(result)
	return string(jsonBytes)
}

func getTickerForDateJS(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return `{"error": "ticker and dateKey parameters are required"}`
	}

	ticker := args[0].String()
	dateKey := args[1].Int()

	record := getTickerDataForDate(ticker, dateKey)
	if record == nil {
		return `{"error": "no data found"}`
	}

	result := map[string]interface{}{
		"ticker": record.Ticker,
		"date":   record.DateKey,
		"open":   record.StockOpen,
		"high":   record.StockHigh,
		"low":    record.StockLow,
		"close":  record.StockClose,
		"volume": record.Volume,
	}
	jsonBytes, _ := json.Marshal(result)
	return string(jsonBytes)
}

func getOHLCJS(this js.Value, args []js.Value) interface{} {
	if len(args) < 3 {
		return `{"error": "ticker, year, and window parameters are required"}`
	}

	ticker := args[0].String()
	year := args[1].Int()
	window := args[2].String()

	if window == "" {
		window = "monthly"
	}

	response := calculateOHLC(ticker, year, window)
	jsonBytes, _ := json.Marshal(response)
	return string(jsonBytes)
}

func getDailyData(ticker string, year int, month int) DailyResponse {
	var dailyRecords []DailyData
	ticker = strings.ToUpper(ticker)

	for _, record := range stockData {
		if record.Ticker != ticker {
			continue
		}

		recordYear := int(record.DateKey) / 10000
		recordMonth := (int(record.DateKey) % 10000) / 100

		if recordYear != year || recordMonth != month {
			continue
		}

		day := int(record.DateKey) % 100
		dateStr := fmt.Sprintf("%d-%02d-%02d", recordYear, recordMonth, day)

		dailyRecords = append(dailyRecords, DailyData{
			Date:   dateStr,
			Open:   record.StockOpen,
			High:   record.StockHigh,
			Low:    record.StockLow,
			Close:  record.StockClose,
			Volume: record.Volume,
		})
	}

	// Sort by date
	sort.Slice(dailyRecords, func(i, j int) bool {
		return dailyRecords[i].Date < dailyRecords[j].Date
	})

	return DailyResponse{
		Ticker: ticker,
		Year:   year,
		Month:  month,
		Data:   dailyRecords,
	}
}

func getDailyJS(this js.Value, args []js.Value) interface{} {
	if len(args) < 3 {
		return `{"error": "ticker, year, and month parameters are required"}`
	}

	ticker := args[0].String()
	year := args[1].Int()
	month := args[2].Int()

	response := getDailyData(ticker, year, month)
	jsonBytes, _ := json.Marshal(response)
	return string(jsonBytes)
}

func main() {
	if err := loadData(); err != nil {
		println("Failed to load data:", err.Error())
		return
	}

	// Export functions to JavaScript
	js.Global().Set("getTickers", js.FuncOf(getTickersJS))
	js.Global().Set("getOHLC", js.FuncOf(getOHLCJS))
	js.Global().Set("getDaily", js.FuncOf(getDailyJS))
	js.Global().Set("getDates", js.FuncOf(getDatesJS))
	js.Global().Set("getTickerForDate", js.FuncOf(getTickerForDateJS))

	println("WASM module initialized with", len(stockData), "records")

	// Keep the program running
	<-make(chan struct{})
}
