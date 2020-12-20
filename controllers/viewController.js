exports.getOverview = (req, res) => {
    res.status(200).render("overview")
};


exports.getTourDetail = (req, res) => {
    res.status(200).render("tour")
}