import Task from "../schemas/Task.mjs";

const updateTaskStatuses = async () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    try {
      await Task.updateMany(
        {
          dueDate: { $lt: currentDate },
          status: 'active'
        },
        { $set: { status: 'pending' } }
      );
      
      // Fetch and return updated tasks after updating
      return await Task.find({}).sort({ dueDate: 1 });
    } catch (error) {
      throw new Error(`Failed to update task statuses: ${error.message}`);
    }
  };
  export default updateTaskStatuses ;