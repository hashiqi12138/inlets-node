import { Worker, WorkerType } from "./Worker";


class TCPWorker implements Worker {
    type: WorkerType = 'TCP';
    activeConnections: any[] = [];
    handleConnection: () => {};
    listen: () => {};
    start: () => {
        
    }
}