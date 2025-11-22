import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import date, datetime
from db import init_db, run_query
from utils import get_tasks_for_date, create_task, update_task_status, delete_task, update_task_details

# Page Config
st.set_page_config(page_title="Trackit", page_icon="✅", layout="wide")

# Initialize DB
init_db()

# --- Sidebar ---
st.sidebar.title("📅 Navigation")
page = st.sidebar.radio("Go to", ["Tasks", "Analytics"])

# --- Tasks Page ---
if page == "Tasks":
    st.title("✅ To-Do List")

    # 1. Calendar Selection
    col1, col2 = st.columns([1, 3])
    with col1:
        st.subheader("Select Date")
        selected_date = st.date_input("Date", date.today(), label_visibility="collapsed")

    # 2. Display Tasks
    with col2:
        st.subheader(f"Tasks for {selected_date.strftime('%B %d, %Y')}")
        
        tasks = get_tasks_for_date(selected_date)
        
        if tasks is None:
            st.error("Could not fetch tasks. Please check your database connection.")
            st.stop()
            
        if not tasks:
            st.info("No tasks for this day. Add one below!")
        
        total_points = 0
        completed_points = 0

        for task in tasks:
            t_id, t_name, t_points, t_completed = task
            total_points += t_points
            if t_completed:
                completed_points += t_points

            # Task Card
            with st.container(border=True):
                c1, c2, c3, c4 = st.columns([0.5, 4, 1, 1])
                
                # Checkbox for completion
                is_checked = c1.checkbox("", value=t_completed, key=f"check_{t_id}")
                if is_checked != t_completed:
                    update_task_status(t_id, is_checked)
                    st.rerun()

                # Task Name & Points
                c2.markdown(f"**{t_name}**")
                c2.caption(f"{t_points} pts")

                # Update Button (Expander)
                with c3:
                    with st.popover("Edit"):
                        new_name = st.text_input("Name", value=t_name, key=f"name_{t_id}")
                        new_points = st.number_input("Points", value=t_points, step=0.5, key=f"points_{t_id}")
                        if st.button("Save", key=f"save_{t_id}"):
                            update_task_details(t_id, new_name, new_points)
                            st.rerun()

                # Delete Button
                with c4:
                    if st.button("🗑️", key=f"del_btn_{t_id}"):
                        delete_task(t_id)
                        st.rerun()

        # Progress Bar
        if total_points > 0:
            progress = completed_points / total_points
            st.progress(progress, text=f"Progress: {completed_points}/{total_points} Points")

    # 3. Create Task Form
    st.divider()
    st.subheader("Add New Task")
    with st.form("new_task_form"):
        c1, c2, c3 = st.columns([3, 1, 1])
        new_task_name = c1.text_input("Task Name")
        new_task_points = c2.number_input("Points", min_value=0.5, step=0.5, value=1.0)
        is_recurring = c3.checkbox("Daily Recurring?")
        
        submitted = st.form_submit_button("Add Task")
        if submitted:
            if new_task_name:
                create_task(new_task_name, new_task_points, selected_date, is_recurring)
                st.success("Task added!")
                st.rerun()
            else:
                st.error("Please enter a task name.")

# --- Analytics Page ---
elif page == "Analytics":
    st.title("📊 Analytics")
    
    # Query Data
    # Sum points of completed tasks grouped by date
    # We filter for is_recurring=FALSE because we only count concrete completed instances
    query = """
        SELECT date, SUM(points) as total_points
        FROM tasks
        WHERE is_completed = TRUE AND is_recurring = FALSE AND is_visible = TRUE
        GROUP BY date
        ORDER BY date
    """
    data = run_query(query)
    
    if data:
        df = pd.DataFrame(data, columns=["Date", "Points"])
        
        # Line Chart
        fig = px.line(df, x="Date", y="Points", title="Daily Completed Points", markers=True)
        st.plotly_chart(fig, use_container_width=True)
        
        # Stats
        st.metric("Total Points Earned", df["Points"].sum())
        st.metric("Best Day", f"{df.loc[df['Points'].idxmax()]['Date']} ({df['Points'].max()} pts)")
    else:
        st.info("No completed tasks yet. Start working to see analytics!")
