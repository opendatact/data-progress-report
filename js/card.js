function main() {
    $.ajax({method: 'GET', url: 'https://data.ct.gov/resource/j6fx-6c5x.json'})
        .done(function(data, status) {
            console.log('DONE: Status is ', status)
            renderReport(data);
        })
        .fail(function(xhr, status, err) {
            console.error('fail', status, err);
        });

    $.ajax({method: 'GET', url: 'https://data.ct.gov/resource/j6fx-6c5x.json'})
        .done(function(data, status) {
            console.log('DONE: Status is ', status)
            renderReportMetadata(data);
        })
        .fail(function(xhr, status, err) {
            console.error('fail', status, err);
        });
}


function renderReportMetadata(data) {
    var source = $('#metadata-template').html();
    var template = Handlebars.compile(source);
    var context = {
        updated: moment.unix(data.rowsUpdatedAt).fromNow()
    };
    $('.report-header').append(template(context));
}


function renderReport(data) {
    function scoreColor(status) {
        if (['YES'].indexOf(status) !== -1) {
            return 'green';
        }
        else if (['IN PROGRESS'].indexOf(status) !== -1) {
            return 'yellow';
        }
        else if (['NO'].indexOf(status) !== -1) {
            return 'red';
        }
        else {
            return 'gray';
        }
    }

    var source = $('#card-template').html();
    var template = Handlebars.compile(source);

    var cardsHTML = data.map(function(agency) {
        var scores = {};
        ['ado', 'submitted_initial_datasets','published_initial_datasets', 'enterpise_data_inventory_status'].map(function(category) {
            scores[category] = {text: agency[category], color: scoreColor(agency[category])};
        });

        var imgFilename = agency.agency.toLowerCase().replace(/\s+/g, '-');
        var imgPath = 'img/' + imgFilename + '.svg';

        var context = {
            department: agency.agency,
            scores: scores,
            image: imgPath,
            data: data,
        };
        return template(context);
    });

    $('.report-container').html(cardsHTML);
}


$().ready(main);
