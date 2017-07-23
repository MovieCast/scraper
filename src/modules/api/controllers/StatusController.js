import { name, version } from '../../../../package.json';

export class StatusController {
    getStatus(req, res) {
        return res.json({
            name,
            uptime: process.uptime() | 0,
            version
        })
    }
}