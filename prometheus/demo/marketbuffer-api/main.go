package main

import (
	"log"
	"net/http"
	"os"

	"github.com/marketbuffer/api/handlers"
	"github.com/marketbuffer/api/models"
)

func main() {
	// Initialize database connection
	db, err := models.InitDB(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := models.Migrate(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize handlers
	h := handlers.New(db)

	// Setup router
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	// Auth routes
	mux.HandleFunc("POST /api/auth/register", h.Register)
	mux.HandleFunc("POST /api/auth/login", h.Login)
	mux.HandleFunc("POST /api/auth/logout", h.Logout)
	mux.HandleFunc("POST /api/auth/refresh", h.RefreshToken)

	// User routes (authenticated)
	mux.HandleFunc("GET /api/users/me", h.RequireAuth(h.GetCurrentUser))
	mux.HandleFunc("PUT /api/users/me", h.RequireAuth(h.UpdateCurrentUser))
	mux.HandleFunc("GET /api/users/{id}", h.RequireAuth(h.GetUser))

	// Project routes (authenticated)
	mux.HandleFunc("GET /api/projects", h.RequireAuth(h.ListProjects))
	mux.HandleFunc("POST /api/projects", h.RequireAuth(h.CreateProject))
	mux.HandleFunc("GET /api/projects/{id}", h.RequireAuth(h.GetProject))
	mux.HandleFunc("PUT /api/projects/{id}", h.RequireAuth(h.UpdateProject))
	mux.HandleFunc("DELETE /api/projects/{id}", h.RequireAuth(h.DeleteProject))

	// Project files routes
	mux.HandleFunc("GET /api/projects/{id}/files", h.RequireAuth(h.ListProjectFiles))
	mux.HandleFunc("GET /api/projects/{id}/files/{path...}", h.RequireAuth(h.GetProjectFile))
	mux.HandleFunc("PUT /api/projects/{id}/files/{path...}", h.RequireAuth(h.UpdateProjectFile))

	// Apply middleware
	handler := corsMiddleware(loggingMiddleware(mux))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.Method, r.URL.Path, r.RemoteAddr)
		next.ServeHTTP(w, r)
	})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
