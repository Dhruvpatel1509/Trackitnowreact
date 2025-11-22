# Streamlit To-Do List App Walkthrough

I have built the To-Do List app with PostgreSQL integration, recurring tasks, and analytics.

## Features Implemented
1.  **Calendar Navigation**: Select any date to view tasks.
2.  **Task Management**:
    *   Create tasks with points.
    *   **Recurring Tasks**: Mark a task as "Daily Recurring" and it will automatically appear on future dates.
    *   **Update**: Edit task name and points.
    *   **Delete**: Remove tasks (Recurring instances are soft-deleted for the day).
3.  **Analytics**: View a line graph of completed points over time.
4.  **Database**: PostgreSQL schema with `tasks` table.

## How to Run

1.  **Ensure PostgreSQL is running**.
    *   The app tries to connect to `localhost:5432` with user `postgres` and password `password`.
    *   If your credentials differ, edit `.streamlit/secrets.toml`.

2.  **Run the App**:
    ```bash
    streamlit run app.py
    ```

3.  **Verify**:
    *   Open the URL provided (usually `http://localhost:8501`).
    *   Add a task for today.
    *   Check the "Analytics" tab.

## Technical Details
*   **Lazy Instantiation**: Recurring tasks are created for a specific date only when you visit that date.
*   **Soft Deletes**: Deleting a recurring task instance only hides it for that day; it doesn't delete the template.
