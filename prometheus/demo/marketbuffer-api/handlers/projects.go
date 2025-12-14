package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/marketbuffer/api/models"
)

type Handler struct {
	db *sql.DB
}

func New(db *sql.DB) *Handler {
	return &Handler{db: db}
}

type CreateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UpdateProjectRequest struct {
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
}

func (h *Handler) ListProjects(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projects, err := models.ListProjectsByUser(h.db, user.ID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to list projects")
		return
	}

	respondJSON(w, http.StatusOK, projects)
}

func (h *Handler) CreateProject(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name == "" {
		respondError(w, http.StatusBadRequest, "Project name is required")
		return
	}

	project := &models.Project{
		Name:        req.Name,
		Description: req.Description,
		OwnerID:     user.ID,
	}

	if err := models.CreateProject(h.db, project); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to create project")
		return
	}

	respondJSON(w, http.StatusCreated, project)
}

func (h *Handler) GetProject(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projectID := r.PathValue("id")
	if projectID == "" {
		respondError(w, http.StatusBadRequest, "Project ID is required")
		return
	}

	project, err := models.GetProjectByID(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusNotFound, "Project not found")
		return
	}

	// Check access
	if project.OwnerID != user.ID {
		respondError(w, http.StatusForbidden, "Access denied")
		return
	}

	respondJSON(w, http.StatusOK, project)
}

func (h *Handler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projectID := r.PathValue("id")
	if projectID == "" {
		respondError(w, http.StatusBadRequest, "Project ID is required")
		return
	}

	project, err := models.GetProjectByID(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusNotFound, "Project not found")
		return
	}

	// Check ownership
	if project.OwnerID != user.ID {
		respondError(w, http.StatusForbidden, "Access denied")
		return
	}

	var req UpdateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Name != "" {
		project.Name = req.Name
	}
	if req.Description != "" {
		project.Description = req.Description
	}

	if err := models.UpdateProject(h.db, project); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to update project")
		return
	}

	respondJSON(w, http.StatusOK, project)
}

func (h *Handler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projectID := r.PathValue("id")
	if projectID == "" {
		respondError(w, http.StatusBadRequest, "Project ID is required")
		return
	}

	project, err := models.GetProjectByID(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusNotFound, "Project not found")
		return
	}

	// Check ownership
	if project.OwnerID != user.ID {
		respondError(w, http.StatusForbidden, "Access denied")
		return
	}

	if err := models.DeleteProject(h.db, projectID); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to delete project")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "Project deleted successfully"})
}

func (h *Handler) ListProjectFiles(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projectID := r.PathValue("id")
	project, err := models.GetProjectByID(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusNotFound, "Project not found")
		return
	}

	if project.OwnerID != user.ID {
		respondError(w, http.StatusForbidden, "Access denied")
		return
	}

	files, err := models.ListProjectFiles(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to list files")
		return
	}

	respondJSON(w, http.StatusOK, files)
}

func (h *Handler) GetProjectFile(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projectID := r.PathValue("id")
	filePath := r.PathValue("path")

	project, err := models.GetProjectByID(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusNotFound, "Project not found")
		return
	}

	if project.OwnerID != user.ID {
		respondError(w, http.StatusForbidden, "Access denied")
		return
	}

	file, err := models.GetProjectFile(h.db, projectID, filePath)
	if err != nil {
		respondError(w, http.StatusNotFound, "File not found")
		return
	}

	respondJSON(w, http.StatusOK, file)
}

func (h *Handler) UpdateProjectFile(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	projectID := r.PathValue("id")
	filePath := r.PathValue("path")

	project, err := models.GetProjectByID(h.db, projectID)
	if err != nil {
		respondError(w, http.StatusNotFound, "Project not found")
		return
	}

	if project.OwnerID != user.ID {
		respondError(w, http.StatusForbidden, "Access denied")
		return
	}

	var req struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	file, err := models.UpdateProjectFile(h.db, projectID, filePath, req.Content)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to update file")
		return
	}

	respondJSON(w, http.StatusOK, file)
}

// Helper functions
func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}
