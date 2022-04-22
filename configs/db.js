if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://kemono:nsvs6pv14nhn00@apps.8fryh.mongodb.net/drill-prod?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/drill"}
}