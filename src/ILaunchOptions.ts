export interface ILaunchOptions {
    host: string
    port: number
    path: string

    cert: string

    limits: {
        // Set to number of connections per allowed per ip address
        // or to 0 to disable limit
        connections?: number

        // Set to number of requests per second allowed or to 0
        // to disable limit
        requests?: number
    }
}