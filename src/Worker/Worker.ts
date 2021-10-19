export type WorkerType = 'TCP' | 'UDP'

export interface Worker {
    type: WorkerType
    activeConnections: any[]
    handleConnection: () => {}
    listen: () => {}
}