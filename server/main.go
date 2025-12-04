package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/parquet-go/parquet-go"
)

type StockRecord struct {
	Ticker     string  `parquet:"ticker"`
	Source     string  `parquet:"source"`
	DateKey    int32   `parquet:"date_key"`
	StockOpen  float64 `parquet:"stock_open"`
	StockHigh  float64 `parquet:"stock_high"`
	StockLow   float64 `parquet:"stock_low"`
	StockClose float64 `parquet:"stock_close"`
	Volume     int64   `parquet:"volume"`
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

func loadParquetData(dataDir string) error {
	entries, err := os.ReadDir(dataDir)
	if err != nil {
		return fmt.Errorf("failed to read data directory: %w", err)
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".parquet") {
			continue
		}

		filePath := filepath.Join(dataDir, entry.Name())
		log.Printf("Loading parquet file: %s", filePath)

		file, err := os.Open(filePath)
		if err != nil {
			return fmt.Errorf("failed to open parquet file: %w", err)
		}
		defer file.Close()

		stat, err := file.Stat()
		if err != nil {
			return fmt.Errorf("failed to stat file: %w", err)
		}

		reader := parquet.NewGenericReader[StockRecord](file)
		defer reader.Close()
		_ = stat

		records := make([]StockRecord, reader.NumRows())
		n, err := reader.Read(records)
		if err != nil && err != io.EOF {
			return fmt.Errorf("failed to read parquet records: %w", err)
		}

		stockData = append(stockData, records[:n]...)
		log.Printf("Loaded %d records from %s", n, entry.Name())
	}

	log.Printf("Total records loaded: %d", len(stockData))
	return nil
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

	for _, record := range stockData {
		if record.Ticker != ticker {
			continue
		}

		recordYear := int(record.DateKey) / 10000
		if recordYear != year {
			continue
		}

		// For now, only monthly aggregation is supported
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

		// Update open if this is an earlier date
		if record.DateKey < pd.firstDateKey {
			pd.firstDateKey = record.DateKey
			pd.open = record.StockOpen
		}

		// Update close if this is a later date
		if record.DateKey > pd.lastDateKey {
			pd.lastDateKey = record.DateKey
			pd.close = record.StockClose
		}

		// Track high/low
		if record.StockHigh > pd.high {
			pd.high = record.StockHigh
		}
		if record.StockLow < pd.low {
			pd.low = record.StockLow
		}

		// Accumulate volume and VWAP components
		pd.volume += record.Volume
		typicalPrice := (record.StockHigh + record.StockLow + record.StockClose) / 3
		pd.totalPriceVolume += typicalPrice * float64(record.Volume)
	}

	// Build response
	response := OHLCResponse{
		Ticker: ticker,
		Year:   year,
		Window: window,
		Data:   []OHLCData{},
	}

	// Sort periods
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

func getDailyData(ticker string, year int, month int) DailyResponse {
	var dailyRecords []DailyData

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

func dailyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	ticker := r.URL.Query().Get("ticker")
	yearStr := r.URL.Query().Get("year")
	monthStr := r.URL.Query().Get("month")

	if ticker == "" || yearStr == "" || monthStr == "" {
		http.Error(w, `{"error": "ticker, year, and month parameters are required"}`, http.StatusBadRequest)
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		http.Error(w, `{"error": "invalid year parameter"}`, http.StatusBadRequest)
		return
	}

	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		http.Error(w, `{"error": "invalid month parameter"}`, http.StatusBadRequest)
		return
	}

	ticker = strings.ToUpper(ticker)
	response := getDailyData(ticker, year, month)

	json.NewEncoder(w).Encode(response)
}

func tickersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Collect unique tickers
	tickerSet := make(map[string]bool)
	for _, record := range stockData {
		tickerSet[record.Ticker] = true
	}

	// Convert to sorted slice
	tickers := make([]string, 0, len(tickerSet))
	for ticker := range tickerSet {
		tickers = append(tickers, ticker)
	}
	sort.Strings(tickers)

	json.NewEncoder(w).Encode(map[string][]string{"tickers": tickers})
}

func ohlcHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	ticker := r.URL.Query().Get("ticker")
	yearStr := r.URL.Query().Get("year")
	window := r.URL.Query().Get("window")

	if ticker == "" || yearStr == "" {
		http.Error(w, `{"error": "ticker and year parameters are required"}`, http.StatusBadRequest)
		return
	}

	// Default to monthly if not specified
	if window == "" {
		window = "monthly"
	}

	// Validate window parameter
	if window != "monthly" && window != "weekly" && window != "daily" {
		http.Error(w, `{"error": "window must be 'monthly', 'weekly', or 'daily'"}`, http.StatusBadRequest)
		return
	}

	// Only monthly is currently supported
	if window != "monthly" {
		http.Error(w, `{"error": "only 'monthly' window is currently supported"}`, http.StatusNotImplemented)
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		http.Error(w, `{"error": "invalid year parameter"}`, http.StatusBadRequest)
		return
	}

	ticker = strings.ToUpper(ticker)
	response := calculateOHLC(ticker, year, window)

	json.NewEncoder(w).Encode(response)
}

func main() {
	// Load parquet data
	dataDir := "./data"
	if envDir := os.Getenv("DATA_DIR"); envDir != "" {
		dataDir = envDir
	}

	log.Printf("Loading data from: %s", dataDir)
	if err := loadParquetData(dataDir); err != nil {
		log.Fatalf("Failed to load parquet data: %v", err)
	}

	// Static file server for the web app
	staticDir := ".."
	if envStatic := os.Getenv("STATIC_DIR"); envStatic != "" {
		staticDir = envStatic
	}

	// API endpoints
	http.HandleFunc("/api/tickers", tickersHandler)
	http.HandleFunc("/api/ohlc", ohlcHandler)
	http.HandleFunc("/api/daily", dailyHandler)

	// Static files (serve index.html for root, and other static assets)
	fs := http.FileServer(http.Dir(staticDir))
	http.Handle("/", fs)

	port := "8080"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}

	log.Printf("Server starting on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
