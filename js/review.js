var thanks = "Thank you! Your review has been saved";

$(document).ready(function () {
    $('#leaveReview').click(function () {
        var reviewForm = document.getElementById('userReview');
        var review = reviewForm.value;
        alreadyLeftReview();
        console.log(review);
    })
})