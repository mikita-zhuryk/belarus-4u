var thanks = "Thank you! Your review has been saved";

$(document).ready(function () {
    $('#leaveReview').click(function () {
        var reviewForm = document.getElementById('userReview');
        var review = reviewForm.value;
        reviewForm.value = thanks;
        $("#leaveReview").hide();
        console.log(review);
    })
})