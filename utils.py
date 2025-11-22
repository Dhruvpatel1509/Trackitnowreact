from db import run_query
from datetime import date

def ensure_recurring_tasks(selected_date):
    """
    Ensures that for every active recurring task, there is a concrete instance
    for the selected_date.
    """
    # 1. Get all recurring templates
    # We only care about recurring tasks created on or before the selected date
    templates = run_query(
        "SELECT id, name, points FROM tasks WHERE is_recurring = TRUE AND date <= %s", 
        (selected_date,)
    )
    
    if not templates:
        return

    for template in templates:
        t_id, t_name, t_points = template
        
        # 2. Check if an instance already exists for this date
        existing = run_query(
            "SELECT id FROM tasks WHERE parent_id = %s AND date = %s",
            (t_id, selected_date),
            fetch_all=False
        )
        
        if not existing:
            # 3. Create the instance
            run_query(
                """
                INSERT INTO tasks (name, points, date, is_recurring, is_completed, parent_id)
                VALUES (%s, %s, %s, FALSE, FALSE, %s)
                """,
                (t_name, t_points, selected_date, t_id)
            )

def get_tasks_for_date(selected_date):
    """
    Fetches all non-recurring (concrete) tasks for a specific date.
    This includes one-time tasks AND instances of recurring tasks.
    """
    # First ensure instances exist
    ensure_recurring_tasks(selected_date)
    
    # Then fetch them
    # We exclude the 'templates' themselves (is_recurring=TRUE) from the daily view
    # We only want concrete tasks (is_recurring=FALSE) for that date
    return run_query(
        "SELECT id, name, points, is_completed FROM tasks WHERE date = %s AND is_recurring = FALSE AND is_visible = TRUE ORDER BY id",
        (selected_date,)
    )

def create_task(name, points, task_date, is_recurring):
    """Creates a new task. If recurring, it's a template. If not, it's a concrete task."""
    query = """
        INSERT INTO tasks (name, points, date, is_recurring, is_completed, is_visible)
        VALUES (%s, %s, %s, %s, FALSE, TRUE)
    """
    run_query(query, (name, points, task_date, is_recurring))

def update_task_status(task_id, is_completed):
    run_query("UPDATE tasks SET is_completed = %s WHERE id = %s", (is_completed, task_id))

def delete_task(task_id):
    # Check if it's a recurring instance (has parent_id)
    res = run_query("SELECT parent_id FROM tasks WHERE id = %s", (task_id,), fetch_all=False)
    
    if res and res[0] is not None:
        # It's an instance of a recurring task -> Soft Delete
        run_query("UPDATE tasks SET is_visible = FALSE WHERE id = %s", (task_id,))
    else:
        # It's a one-time task or a template -> Hard Delete
        run_query("DELETE FROM tasks WHERE id = %s", (task_id,))

def update_task_details(task_id, name, points):

    run_query("UPDATE tasks SET name = %s, points = %s WHERE id = %s", (name, points, task_id))
