import Task from "../schemas/Task.mjs";

const updateTaskStatuses = async (username) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    try {
        // Ensure username is part of the query
        // console.log(`Updating task statuses for user: ${username}`);
        

        // Update tasks for the specific user
        await Task.updateMany(
            {
                username, // Filter by username
                dueDate: { $lt: currentDate },
                status: 'active',
            },
            { $set: { status: 'pending' } }
        );

        // Fetch and return updated tasks for the specific user
        return await Task.find({ username }).sort({ dueDate: 1 });
    } catch (error) {
        console.log(`Failed to update task statuses: ${error.message}`);
        return [];
    }
};

export default updateTaskStatuses;
