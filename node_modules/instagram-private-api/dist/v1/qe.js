"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const resource_1 = require("./resource");
const CONSTANTS = require("../constants/constants");
const request_1 = require("../core/request");
class QE extends resource_1.InstagramResource {
    static sync(session) {
        const random = parseInt(`${Math.random() * 100}`) + 1;
        const experiments = _.sampleSize(CONSTANTS.EXPERIMENTS, random);
        return session.getAccountId().then(id => new request_1.Request(session)
            .setMethod('POST')
            .setResource('qeSync')
            .generateUUID()
            .setData({
            id,
            _uid: id,
            experiments: experiments.join(','),
        })
            .signPayload()
            .send());
    }
}
exports.QE = QE;
//# sourceMappingURL=qe.js.map