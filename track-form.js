$(document).ready(function() {
    var formCount = 0;
    var elementCount = 0;
    var forms = {};
    var elements = [];
    var result = {};
    var element = {};

    //assign ids to form and elements
    $('form').each(function() {
        forms = {};
        elementCount = 0;
        formCount++;
        $(this).attr("id", "form" + formCount);
        var formId = $(this).attr("id");
        result[formId] = {
            "formStartTime": 0,
            "formEndTime": 0,
            "successfulSubmission": false
        };
        elements = [];
        $(this).find(':input').each(function() {
            element = {};
            elementCount++;
            $(this).attr("id", "form" + formCount + "_element" + elementCount);
            var elementId = "element" + elementCount;
            element[elementId] = {
                "startTime": 0,
                "totalTime": 0,
                "noOfTimesEdited": 0
            };
            elements.push(element);
            result[formId].elements = elements;
        });
        result[formId].noOfElements = elementCount;
    });

    //method to know if form submission is successful
    $('form').bind('submit', function() {
        var idSplit = $(this).attr('id').split("_");
        result[idSplit[0]].formEndTime = new Date();
        storeData();
        localStorage.finalResult = JSON.stringify(result);
        //return false;
        result[idSplit[0]].successfulSubmission = true;
        storeData();
        localStorage.finalResult = JSON.stringify(result);
    });

    //assign time to input elements
    $('form input').bind('click change keypress', function() {
        storeData();
        localStorage.finalResult = JSON.stringify(result);
        if ($(this).attr('type').toLowerCase() != "submit".toLowerCase()) {
            var idSplit = $(this).attr('id').split("_");
            var elementIndex = idSplit[1].split("element");
            if (!result[idSplit[0]].formStartTime || result[idSplit[0]].formStartTime == 0) {
                result[idSplit[0]].formStartTime = new Date();
            }
            if (result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime == 0) {
                result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime = new Date();
            }
            storeData();
            localStorage.finalResult = JSON.stringify(result);
        }
    });

    //assign time to select elements
    $('form select').bind('click change keypress', function() {
        var idSplit = $(this).attr('id').split("_");
        var elementIndex = idSplit[1].split("element");
        if (!result[idSplit[0]].formStartTime || result[idSplit[0]].formStartTime == 0) {
            result[idSplit[0]].formStartTime = new Date();
        }
        if (result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime == 0) {
            result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime = new Date();
        }
        storeData();
        localStorage.finalResult = JSON.stringify(result);
    });

    //calculate time spent on each input element
    $('form input').bind('focusout', function() {
        if ($(this).attr('type').toLowerCase() != "submit".toLowerCase()) {
            var idSplit = $(this).attr('id').split("_");
            var elementIndex = idSplit[1].split("element");
            if (result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime != 0) {
                result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].totalTime += (new Date() - result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime) / 1000;
                result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].noOfTimesEdited++;
                result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime = 0;
            }
        }
        storeData();
        localStorage.finalResult = JSON.stringify(result);
    });

    //calculate time spent on each select element
    $('form select').bind('focusout', function() {
        var idSplit = $(this).attr('id').split("_");
        var elementIndex = idSplit[1].split("element");
        if (result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime != 0) {
            result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].totalTime += (new Date() - result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime) / 1000;
            result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].noOfTimesEdited++;
            result[idSplit[0]].elements[elementIndex[1] - 1][idSplit[1]].startTime = 0;
        }
        storeData();
        localStorage.finalResult = JSON.stringify(result);
    });

    //calculate total time taken to fill a form and number of times the elements were edited
    function storeData() {
        for (var i = 0; i < formCount; i++) {
            var totalNoOfTimesEdited = 0;
            var formFillingTime = 0;
            var formId = "form" + (i + 1);
            for (var j = 0; j < result[formId].noOfElements; j++) {
                formFillingTime += result[formId].elements[j]["element" + (j + 1)].totalTime;
                totalNoOfTimesEdited += result[formId].elements[j]["element" + (j + 1)].noOfTimesEdited;
            }
            result[formId].formFillingTime = formFillingTime;
            result[formId].totalNoOfTimesEdited = totalNoOfTimesEdited;
        }
    }
});
