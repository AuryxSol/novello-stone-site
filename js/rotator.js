// Simple crossfade photo rotator for .photo-rotator elements.
// Each rotator cycles through its child <img> tags automatically.
(function () {
    function startRotator(el) {
          var imgs = el.querySelectorAll('img');
          if (imgs.length < 2) return;
          var index = 0;
          var intervalMs = parseInt(el.dataset.interval, 10) || 4000;

          setInterval(function () {
                  imgs[index].classList.remove('is-active');
                  index = (index + 1) % imgs.length;
                  imgs[index].classList.add('is-active');
                }, intervalMs);
        }

    document.addEventListener('DOMContentLoaded', function () {
          var rotators = document.querySelectorAll('.photo-rotator');
          rotators.forEach(startRotator);
        });
  })();
