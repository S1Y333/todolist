
exports.getDate = function () {
let today = new Date();
    
    var options = {
        weekday: "long",
        day: "numeric",
        month:"long",
        year: "numeric"
    }

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function () {
    let today = new Date();
        
        var options = {
            weekday: "long",
            
        }
    
        return today.toLocaleDateString("en-US", options);
    }