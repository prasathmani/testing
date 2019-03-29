/**
 * Job Search App
 */

class JobSearchApp {
    constructor() {
        this.initialize()
    }

    initialize() {
        this.api = 'https://api.myjson.com/bins/kez8a';
        this.appStore = {};
        this.noOfJobjs = 0;
        this.experienceList = [];
        this.locationList = [];
        this.searchReult = [];
        this.$el = $('.main-wrapper');

        //Events
        this.events();

        //init
        this.getApiData();
    }

    /**
     * Register Events
     */
    events() {
        let self = this;
        $("#js-getApps").on("click", function () {
            self.getApiData();
        });

        $("a.app-card").on("click", function (e) {
            e.preventDefault();
            let selectedAppId = $(this).attr("data-href");
            console.log(self.getAppsById(selectedAppId));
        });

        //job serach
        $("#job-search-form").on("submit", function (e) {
            e.preventDefault();
            let experience = self.$el.find("#js-experience").val();
            let location = self.$el.find("#js-location").val();
            let serachTerm = self.$el.find("#js-search").val();
            self.jobSearch(experience, location, serachTerm);
        });

        //sort by
        $('#js-location--filter, #js-sort-by').on('click', function () {
            let type = $(this).data('type');
            self.jobSorting(type);
        });
    }

    /**
     * Get data from API
     */
    getApiData() {
        let self = this;
        $.getJSON(this.api, function (json) {
            self.appStore = json.jobsfeed;
            self.renderApps();
        });
    }

    /**
     * Render Apps
     */
    renderApps() {
        this.renderComponents();
        this.appCardTemplate(this.appStore);
    }

    /**
     * Render static components
     */
    renderComponents() {
        let self = this;
        $.each(this.appStore, function (i, f) {
            self.uniqueDataPush(self.experienceList, f.experience);
            self.uniqueDataPush(self.locationList, f.location);
        });

        //render static components
        this.renderSearchItems($("#js-experience"), ' - Experience - ', this.experienceList.sort((a, b) => a - b));
        this.renderSearchItems($("#js-location"), ' - Location - ', this.locationList.sort());

        this.$el.find('#js-total-result').html(this.appStore.length);
    }

    /**
     * Push unique item to array
     * @param filters
     * @param newFilter
     */
    uniqueDataPush(filters, newFilter) {
        if ($.inArray(newFilter, filters) < 0) {
            filters.push(newFilter);
        }
        else {
            filters.splice($.inArray(newFilter, filters), 1);
        }
    }

    /**
     * Static components template
     * @param $target
     * @param placeholder
     * @param data
     */
    renderSearchItems($target, placeholder, data) {
        let _template = `<option value="">${placeholder}</option>`;
        $.each(data, function (i, f) {
            _template += `<option value="${f}">${f}</option>`;
        });
        $target.html(_template);
    }

    /**
     * Empty check util
     * @param data
     * @param template
     * @returns {*}
     */
    templateEmptyCheck(data, template) {
        if (data) {
            return template;
        }
        return '';
    }

    /**
     * App card template
     * @param data
     * @returns {HTML}
     */
    appCardTemplate(data) {
        let _template = '',
            self = this;
        if (data && data.length) {
            $.each(data, function (i, f) {
                _template += `<div class="col-xs-12 col-md-6 mb-3">
                                <a href="${f.applyink}" class="job-card__box bg-white">
                                    <div class="job-card__box--title">
                                        ${self.templateEmptyCheck(f.title, `<h4 class="float-left">${f.title}</h4>`)}
                                        ${self.templateEmptyCheck(f.salary, `<label class="badge badge-light">${f.salary}</label>`)}
                                        ${self.templateEmptyCheck(f.type, `<span class="badge badge-light">${f.type}</span>`)}
                                    </div>
                                    <div class="job-card__box--company">
                                        ${self.templateEmptyCheck(f.companyname, `<label><img src="assets/img/three-buildings.svg" alt="Office"> ${f.companyname}</label>`)}
                                        ${self.templateEmptyCheck(f.location, `<label><img src="assets/img/location-pointer.svg" alt="Office"> ${f.location}</label>`)}
                                    </div>
                                    <div class="job-card__box--date">
                                        ${self.templateEmptyCheck(f.salary, `<label>Start: <span>${f.startdate}</span></label> -`)}
                                        ${self.templateEmptyCheck(f.salary, `<label>End: <span>${f.startdate}</span></label>`)}
                                    </div>
                                    <div class="job-card__box--others">
                                        ${self.templateEmptyCheck(f.salary, `<label>Source: ${f.source}</label>`)}
                                        <button href="${f.applyink}" title="Apply" class="btn btn-sm btn-success float-right">Apply</button>
                                    </div>
                                </a>
                            </div>`;
            });
        } else {
            _template += `<div class="col-xs-12 col-md-12 text-center mb-3"><h4>No Jobs Found!</h4></div>`;
        }

        $(".job-card__results").empty().html(_template);
    }

    /**
     * Find an item in Array
     * @param arr
     * @param term
     * @returns {Array}
     */
    findItem(arr, term) {
        var items = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            for (var prop in item) {
                var detail = item[prop].toString().toLowerCase();
                if (detail.indexOf(term) > -1) {
                    items.push(item);
                    break;
                }
            }
        }
        return items;
    }


    /**
     * Job Search Based user inputs
     * @param experience
     * @param location
     * @param serachTerm
     */
    jobSearch(experience, location, serachTerm) {
        let self = this,
            appStore = this.appStore,
            result = [];
        this.searchReult = [];

        if (experience && result.length > 0) {
            result = result.filter(function (job) {
                return job.experience == experience;
            });
        } else if (experience) {
            result = appStore.filter(function (job) {
                return job.experience == experience;
            });
        }

        if (result.length > 0 && location) {
            result = result.filter(function (job) {
                return job.location == location;
            });
        } else if (location) {
            result = appStore.filter(function (job) {
                return job.location == location;
            });
        }

        if (result.length && serachTerm) {
            result = self.findItem(result, serachTerm);
        } else if (result.length === 0) {
            result = self.findItem(appStore, serachTerm);
        }

        this.searchReult = result;
        self.renderJobSearchResult(result);
    }

    /**
     * Call render job card
     * @param data
     */
    renderJobSearchResult(data) {
        this.$el.find('#js-total-result').html(data.length);
        this.appCardTemplate(data);
    }

    /**
     * Sorting search result
     * @param type
     */
    jobSorting(type) {
        let result = (this.searchReult && this.searchReult.length) ? this.searchReult : this.appStore;
        if (type == 'location') {
            result = result.sort((a, b) => a.location !== b.location ? a.location < b.location ? -1 : 1 : 0);
        }

        if (type == 'experience') {
            result = result.sort((a, b) => parseInt(a.experience) - parseInt(b.experience));
        }

        this.renderJobSearchResult(result);
    }
}

new JobSearchApp()
