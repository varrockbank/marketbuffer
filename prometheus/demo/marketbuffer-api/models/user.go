package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Never expose in JSON
	Name         string    `json:"name"`
	IsAdmin      bool      `json:"is_admin"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func CreateUser(db *sql.DB, user *User) error {
	user.ID = uuid.New().String()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	query := `
		INSERT INTO users (id, email, password_hash, name, is_admin, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err := db.Exec(query,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.Name,
		user.IsAdmin,
		user.CreatedAt,
		user.UpdatedAt,
	)

	return err
}

func GetUserByID(db *sql.DB, id string) (*User, error) {
	user := &User{}
	query := `
		SELECT id, email, password_hash, name, is_admin, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	err := db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.IsAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetUserByEmail(db *sql.DB, email string) (*User, error) {
	user := &User{}
	query := `
		SELECT id, email, password_hash, name, is_admin, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	err := db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.IsAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func UpdateUser(db *sql.DB, user *User) error {
	user.UpdatedAt = time.Now()

	query := `
		UPDATE users
		SET email = $2, password_hash = $3, name = $4, is_admin = $5, updated_at = $6
		WHERE id = $1
	`

	_, err := db.Exec(query,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.Name,
		user.IsAdmin,
		user.UpdatedAt,
	)

	return err
}

func DeleteUser(db *sql.DB, id string) error {
	query := `DELETE FROM users WHERE id = $1`
	_, err := db.Exec(query, id)
	return err
}

func ListUsers(db *sql.DB) ([]*User, error) {
	query := `
		SELECT id, email, password_hash, name, is_admin, created_at, updated_at
		FROM users
		ORDER BY created_at DESC
	`

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		user := &User{}
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.PasswordHash,
			&user.Name,
			&user.IsAdmin,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
