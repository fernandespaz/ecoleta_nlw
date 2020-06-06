import { Request, Response } from 'express';
import Knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await Knex('points')
        .join('point_items','points.id','=','point_items.point_id')
        .whereIn('point_items.item_id',parsedItems)
        .where('city',String(city))
        .where('uf',String(uf))
        .distinct()
        .select('points.*')

        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await Knex('points').where('id', id).first()

        if (!point) {
            return response.status(400).json({ message: 'Point Not Found' });
        }

        const items = await Knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point, items });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await Knex.transaction(); 

        const insertedIds = await trx('points').insert({
            image: 'https://lh3.googleusercontent.com/proxy/ofNHybOmdRtpB920lKQ-jq1CN9RMrOU68mc3wxPoi9LwxsudYQeX3R7Mm5vZkTlFeS6Zb-bOxSTKRl205DhwehvGTubxcBSTwrfLqVcCoRU9hSHXvQI90dnxDH7s480-p0Z2vL_jZG7RxtU',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        });

        const point_id = insertedIds[0]

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({ success: true });

    };
}

export default PointsController;