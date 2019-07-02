import { InstagramResponse } from './instagram.response';
export declare class LocationResponse extends InstagramResponse {
    pk: string | number;
    name: string;
    address: string;
    city: string;
    short_name: string;
    lng: number;
    lat: number;
    external_source: string;
    facebook_places_id: string | number;
    location_dict: LocationResponse;
}
