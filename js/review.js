$(document).ready(function () {
    $('#leaveReview').click(function () {
        var reviewForm = document.getElementById('userReview');
        var review = reviewForm.value;
        reviewForm.value = "";
        console.log(review);
    })
})