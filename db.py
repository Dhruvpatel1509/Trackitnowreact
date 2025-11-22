import psycopg2
import streamlit as st
from datetime import datetime

def get_db_connection():
    """Establishes a connection to the PostgreSQL database using secrets."""
    try:
        conn = psycopg2.connect(
            host=st.secrets["postgres"]["host"],
            port=st.secrets["postgres"]["port"],
            database=st.secrets["postgres"]["dbname"],
            user=st.secrets["postgres"]["user"],
            password=st.secrets["postgres"]["password"]
        )
        return conn
    except Exception as e:
        st.error(f"Error connecting to database: {e}")
        return None

def init_db():
    """Initializes the database schema if it doesn't exist."""
    conn = get_db_connection()
    if not conn:
        return

    try:
        cur = conn.cursor()
        
        # Create tasks table
        # is_recurring: If true, this is a 'template' task that repeats daily.
        # parent_id: If set, this task is a specific instance of a recurring task (parent_id points to the template).
        # date: For one-time tasks, the specific date. For recurring templates, the start date.
        cur.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                points FLOAT NOT NULL,
                date DATE NOT NULL,
                is_recurring BOOLEAN DEFAULT FALSE,
                is_completed BOOLEAN DEFAULT FALSE,
                parent_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                is_visible BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Check if is_visible column exists (migration for existing db)
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='tasks' AND column_name='is_visible'")
        if not cur.fetchone():
            cur.execute("ALTER TABLE tasks ADD COLUMN is_visible BOOLEAN DEFAULT TRUE")
            conn.commit()

        
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        st.error(f"Error initializing database: {e}")

def run_query(query, params=None, fetch_all=True):
    """Helper to run queries safely."""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cur = conn.cursor()
        cur.execute(query, params)
        
        if query.strip().upper().startswith("SELECT"):
            if fetch_all:
                result = cur.fetchall()
            else:
                result = cur.fetchone()
        else:
            conn.commit()
            result = True
            
        cur.close()
        conn.close()
        return result
    except Exception as e:
        st.error(f"Query error: {e}")
        if conn:
            conn.close()
        return None
