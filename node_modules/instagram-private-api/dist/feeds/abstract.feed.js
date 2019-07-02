"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chance = require("chance");
const _ = require("lodash");
const Bluebird = require("bluebird");
const exceptions_1 = require("../core/exceptions");
const events_1 = require("events");
class AbstractFeed extends events_1.EventEmitter {
    constructor(session) {
        super();
        this.session = session;
        this.allResults = [];
        this.totalCollected = 0;
        this.cursor = null;
        this.moreAvailable = null;
        this.iteration = 0;
        this.parseErrorsMultiplier = 0;
        this._stopAll = false;
        const chance = new Chance();
        this.rankToken = chance.guid();
    }
    all(parameters = {}) {
        parameters = Object.assign({
            delay: 1500,
            every: 200,
            pause: 30000,
            maxErrors: 9,
            limit: this.limit || Infinity,
        }, parameters);
        const delay = this.iteration === 0 ? 0 : this.iteration % parameters.every !== 0 ? parameters.delay : parameters.pause;
        return (Bluebird.delay(delay)
            .then(this.get.bind(this))
            .then(results => {
            this.parseErrorsMultiplier = 0;
            return results;
        })
            .catch(exceptions_1.ParseError, () => {
            this.parseErrorsMultiplier++;
            if (this.parseErrorsMultiplier > parameters.maxErrors)
                throw new exceptions_1.RequestsLimitError();
            return Bluebird.resolve([]).delay(parameters.pause * this.parseErrorsMultiplier);
        })
            .then((response) => {
            const results = response.filter(this.filter).map(this.map);
            if (_.isFunction(this.reduce))
                this.allResults = this.reduce(this.allResults, results);
            this.totalCollected += response.length;
            this._handleInfinityListBug(response, results);
            this.emit('data', results);
            let exceedLimit = false;
            if ((parameters.limit && this.totalCollected > parameters.limit) || this._stopAll === true)
                exceedLimit = true;
            if (this.isMoreAvailable() && !exceedLimit) {
                this.iteration++;
                return this.all(parameters);
            }
            else {
                this.iteration = 0;
                this.emit('end', this.allResults);
                return this.allResults;
            }
        }));
    }
    map(item) {
        return item;
    }
    reduce(accumulator, response) {
        return accumulator.concat(response);
    }
    filter() {
        return true;
    }
    _handleInfinityListBug(response, results) {
        const that = this;
        if (this.iteration % 2 === 0) {
            this.allResultsMap = {};
            this._allResultsLentgh = 0;
        }
        this._allResultsLentgh += response.length;
        response.forEach(result => {
            that.allResultsMap[result.id] = undefined;
        });
        if (_.keys(this.allResultsMap).length !== this._allResultsLentgh)
            this.stop();
    }
    stop() {
        this._stopAll = true;
    }
    setCursor(cursor) {
        this.cursor = cursor;
    }
    getCursor() {
        return this.cursor;
    }
    isMoreAvailable() {
        return !!this.moreAvailable;
    }
    allSafe(parameters, timeout = 10 * 60 * 1000) {
        const that = this;
        return this.all(parameters)
            .timeout(timeout || this.timeout)
            .catch(Bluebird.TimeoutError, reason => {
            that.stop();
            throw reason;
        });
    }
}
exports.AbstractFeed = AbstractFeed;
//# sourceMappingURL=abstract.feed.js.map