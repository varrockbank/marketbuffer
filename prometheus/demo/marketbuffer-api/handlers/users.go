package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/marketbuffer/api/models"
	"golang.org/x/crypto/bcrypt"
)

type UpdateUserRequest struct {
	Name     string `json:"name,omitempty"`
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

func (h *Handler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	respondJSON(w, http.StatusOK, user)
}

func (h *Handler) UpdateCurrentUser(w http.ResponseWriter, r *http.Request) {
	user := GetUserFromContext(r.Context())
	if user == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	var req UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Update fields if provided
	if req.Name != "" {
		user.Name = req.Name
	}

	if req.Email != "" {
		// Check if email is already taken
		existing, _ := models.GetUserByEmail(h.db, req.Email)
		if existing != nil && existing.ID != user.ID {
			respondError(w, http.StatusConflict, "Email already in use")
			return
		}
		user.Email = req.Email
	}

	if req.Password != "" {
		if len(req.Password) < 8 {
			respondError(w, http.StatusBadRequest, "Password must be at least 8 characters")
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "Failed to process password")
			return
		}
		user.PasswordHash = string(hashedPassword)
	}

	if err := models.UpdateUser(h.db, user); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to update user")
		return
	}

	respondJSON(w, http.StatusOK, user)
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("id")
	if userID == "" {
		respondError(w, http.StatusBadRequest, "User ID is required")
		return
	}

	user, err := models.GetUserByID(h.db, userID)
	if err != nil {
		respondError(w, http.StatusNotFound, "User not found")
		return
	}

	// Return public user info only
	publicUser := struct {
		ID        string `json:"id"`
		Name      string `json:"name"`
		CreatedAt string `json:"created_at"`
	}{
		ID:        user.ID,
		Name:      user.Name,
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	respondJSON(w, http.StatusOK, publicUser)
}

func (h *Handler) ListUsers(w http.ResponseWriter, r *http.Request) {
	// Admin only endpoint
	currentUser := GetUserFromContext(r.Context())
	if currentUser == nil || !currentUser.IsAdmin {
		respondError(w, http.StatusForbidden, "Admin access required")
		return
	}

	users, err := models.ListUsers(h.db)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to list users")
		return
	}

	respondJSON(w, http.StatusOK, users)
}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("id")
	if userID == "" {
		respondError(w, http.StatusBadRequest, "User ID is required")
		return
	}

	currentUser := GetUserFromContext(r.Context())
	if currentUser == nil {
		respondError(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	// Users can only delete themselves, unless admin
	if currentUser.ID != userID && !currentUser.IsAdmin {
		respondError(w, http.StatusForbidden, "Cannot delete other users")
		return
	}

	if err := models.DeleteUser(h.db, userID); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to delete user")
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "User deleted successfully"})
}
