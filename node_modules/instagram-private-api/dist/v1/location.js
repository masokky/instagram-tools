"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const camelKeys = require('camelcase-keys');
const helpers_1 = require("../helpers");
const resource_1 = require("./resource");
const request_1 = require("../core/request");
const media_1 = require("./media");
const Exceptions = require("../core/exceptions");
class Location extends resource_1.InstagramResource {
    static getRankedMedia(session, locationId) {
        return (new request_1.Request(session)
            .setMethod('GET')
            .setResource('locationFeed', {
            id: locationId,
            maxId: null,
            rankToken: helpers_1.Helpers.generateUUID(),
        })
            .send()
            .then(data => _.map(data.ranked_items, medium => new media_1.Media(session, medium)))
            .catch(Exceptions.ParseError, () => {
            throw new Exceptions.PlaceNotFound();
        }));
    }
    static search(session, query) {
        return session
            .getAccountId()
            .then(id => {
            const rankToken = helpers_1.Helpers.buildRankToken(id);
            return new request_1.Request(session)
                .setMethod('GET')
                .setResource('locationsSearch', {
                query,
                rankToken,
            })
                .send();
        })
            .then(data => _.map(data.items, location => new Location(session, location)));
    }
    parseParams(json) {
        const hash = camelKeys(json);
        hash.address = json.location.address;
        hash.city = json.location.city;
        hash.state = json.location.state;
        hash.id = json.location.id || json.location.pk;
        hash.lat = parseFloat(json.location.lat) || 0;
        hash.lng = parseFloat(json.location.lng) || 0;
        return hash;
    }
}
exports.Location = Location;
//# sourceMappingURL=location.js.map