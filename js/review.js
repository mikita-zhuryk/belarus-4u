$(document).ready(function () {
    $('#leaveReview').click(function () {
        var reviewForm = document.getElementById('userReview');
        var review = reviewForm.value;
        reviewForm.value = "Thank you! Your review has been saved";
        $("#leaveReview").hide();
        console.log(review);
    })
})