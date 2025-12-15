package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

type Project struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerID     string    `json:"owner_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ProjectFile struct {
	ID        string    `json:"id"`
	ProjectID string    `json:"project_id"`
	Path      string    `json:"path"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func InitDB(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *sql.DB) error {
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id VARCHAR(36) PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255),
			is_admin BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP NOT NULL,
			updated_at TIMESTAMP NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS projects (
			id VARCHAR(36) PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			description TEXT,
			owner_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			created_at TIMESTAMP NOT NULL,
			updated_at TIMESTAMP NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS project_files (
			id VARCHAR(36) PRIMARY KEY,
			project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
			path VARCHAR(1024) NOT NULL,
			content TEXT,
			created_at TIMESTAMP NOT NULL,
			updated_at TIMESTAMP NOT NULL,
			UNIQUE(project_id, path)
		)`,
		`CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id)`,
		`CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id)`,
	}

	for _, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return err
		}
	}

	return nil
}

func CreateProject(db *sql.DB, project *Project) error {
	project.ID = uuid.New().String()
	project.CreatedAt = time.Now()
	project.UpdatedAt = time.Now()

	query := `
		INSERT INTO projects (id, name, description, owner_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	_, err := db.Exec(query,
		project.ID,
		project.Name,
		project.Description,
		project.OwnerID,
		project.CreatedAt,
		project.UpdatedAt,
	)

	return err
}

func GetProjectByID(db *sql.DB, id string) (*Project, error) {
	project := &Project{}
	query := `
		SELECT id, name, description, owner_id, created_at, updated_at
		FROM projects
		WHERE id = $1
	`

	err := db.QueryRow(query, id).Scan(
		&project.ID,
		&project.Name,
		&project.Description,
		&project.OwnerID,
		&project.CreatedAt,
		&project.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return project, nil
}

func ListProjectsByUser(db *sql.DB, userID string) ([]*Project, error) {
	query := `
		SELECT id, name, description, owner_id, created_at, updated_at
		FROM projects
		WHERE owner_id = $1
		ORDER BY updated_at DESC
	`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []*Project
	for rows.Next() {
		project := &Project{}
		err := rows.Scan(
			&project.ID,
			&project.Name,
			&project.Description,
			&project.OwnerID,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}

	return projects, nil
}

func UpdateProject(db *sql.DB, project *Project) error {
	project.UpdatedAt = time.Now()

	query := `
		UPDATE projects
		SET name = $2, description = $3, updated_at = $4
		WHERE id = $1
	`

	_, err := db.Exec(query,
		project.ID,
		project.Name,
		project.Description,
		project.UpdatedAt,
	)

	return err
}

func DeleteProject(db *sql.DB, id string) error {
	query := `DELETE FROM projects WHERE id = $1`
	_, err := db.Exec(query, id)
	return err
}

func ListProjectFiles(db *sql.DB, projectID string) ([]*ProjectFile, error) {
	query := `
		SELECT id, project_id, path, content, created_at, updated_at
		FROM project_files
		WHERE project_id = $1
		ORDER BY path ASC
	`

	rows, err := db.Query(query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []*ProjectFile
	for rows.Next() {
		file := &ProjectFile{}
		err := rows.Scan(
			&file.ID,
			&file.ProjectID,
			&file.Path,
			&file.Content,
			&file.CreatedAt,
			&file.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		files = append(files, file)
	}

	return files, nil
}

func GetProjectFile(db *sql.DB, projectID, path string) (*ProjectFile, error) {
	file := &ProjectFile{}
	query := `
		SELECT id, project_id, path, content, created_at, updated_at
		FROM project_files
		WHERE project_id = $1 AND path = $2
	`

	err := db.QueryRow(query, projectID, path).Scan(
		&file.ID,
		&file.ProjectID,
		&file.Path,
		&file.Content,
		&file.CreatedAt,
		&file.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return file, nil
}

func UpdateProjectFile(db *sql.DB, projectID, path, content string) (*ProjectFile, error) {
	file := &ProjectFile{}
	now := time.Now()

	// Upsert: insert or update
	query := `
		INSERT INTO project_files (id, project_id, path, content, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $5)
		ON CONFLICT (project_id, path) DO UPDATE
		SET content = $4, updated_at = $5
		RETURNING id, project_id, path, content, created_at, updated_at
	`

	err := db.QueryRow(query, uuid.New().String(), projectID, path, content, now).Scan(
		&file.ID,
		&file.ProjectID,
		&file.Path,
		&file.Content,
		&file.CreatedAt,
		&file.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return file, nil
}
