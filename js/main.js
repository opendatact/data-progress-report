"use strict"

function main() {
    $.ajax({ method: 'GET', url: 'https://data.ct.gov/resource/j6fx-6c5x.json' })
        .done(function(data, status) {
            console.log('DONE: Status is ', status)
            renderReport(data);
        }).fail(function(xhr, status, err) {
            console.error('fail', status, err);
        });

    $.ajax({ method: 'GET', url: 'https://data.ct.gov/resource/j6fx-6c5x.json' })
        .done(function(data, status) {
            console.log('DONE: Status is ', status)
            renderReportMetadata(data);
        }).fail(function(xhr, status, err) {
            console.error('fail', status, err);
        });
}

function renderReportMetadata(data) {
    var source      = $('#metadata-template').html(),
        template    = Handlebars.compile(source),
        context     = { updated: moment.unix(data.rowsUpdatedAt).fromNow() };
    
    $(".report-header").append(template(context));
}

function renderReport(data) {
    $(".agency-count").text(data.length);


    // for (var i = 0; i < data.length; i++) {
    //   var $container       = $(".container"),
    //       cardDeptName     = ".item-" + i + " .dept-name",
    //       liasonScore      = ".item-" + i + " .liaison-score",
    //       inventoryScore   = ".item-" + i + " .inventory-score",
    //       plansScore       = ".item-" + i + " .plans-score",
    //       publicationScore = ".item-" + i + " .publication-score";

      // $container.append(htmlBlock);

    var source    = $("#row-template").html(),
        template  = Handlebars.compile(source);

    var rowsHTML = data.map(function(agency) {
        var scores      = {},
            imgFilename = agency.agency.toLowerCase().replace(/\s+/g, '-'),
            imgPath     = 'img/' + imgFilename + '.svg',
            context     = { agency: agency.agency,
                            scores:     scores,
                            image:      imgPath,
                            data:       data };
        
        ['ado', 'submitted_initial_datasets', 'published_initial_datasets', 'enterpise_data_inventory_status'].map(function(category) {
            scores[category] = {text: agency[category], color: scoreColor(agency[category])};
        });

        console.log(scores)

        return template(context);
    });

    $('.report-container').append(rowsHTML);

    //   $container.children().last().addClass("item-"+i);


    //   $(liasonScore + " .score-text").text(data[i].liaison);
    //   $(inventoryScore + " .score-text").text(data[i].inventory);
    //   $(plansScore + " .score-text").text(data[i].plans);
    //   $(publicationScore + " .score-text").text(data[i].publication);

    //   var imgFilename = data[i].dept.toLowerCase().replace(/\s+/g, "-");
    //   var imgPath = "img/" + imgFilename + ".svg";

    //   $(".item-" + i + " .dept-icon").attr("src", imgPath)

    // };

    insertSVGIcon(".liaison-score", liaisonIcon);
    insertSVGIcon(".inventory-score", planIcon);
    insertSVGIcon(".plans-score", publishIcon);
    insertSVGIcon(".publication-score", inventoryIcon);

}

function insertSVGIcon(selector, icon){
  $(selector).prepend(icon)
}

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


$().ready(main);
