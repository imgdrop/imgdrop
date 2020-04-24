export class TaskQueue {
   private currentTask = Promise.resolve();

   runTask<T>(callback: () => Promise<T>): Promise<T> {
      const task = this.currentTask.then(() => callback());
      this.currentTask = task.then(() => {});
      return task;
   }
}
