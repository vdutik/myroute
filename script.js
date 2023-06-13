document.addEventListener('DOMContentLoaded', function () {
    function updateIndicatorPosition() {
        let inputs = document.getElementsByClassName('navToggleInput');
        let indicator = document.querySelector('.navToggle__indicator');

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                let leftPosition = (i / (inputs.length)) * 100;
                indicator.style.left = leftPosition + '%';
                break;
            }
        }
    }

// Attach event listeners to each radio button
    let inputs = document.getElementsByClassName('navToggleInput');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', updateIndicatorPosition);
    }

    updateIndicatorPosition();


    $('.ToggleItem__title').on('click', function () {
        $(this).closest('.ToggleItem').toggleClass('open')
    })
})