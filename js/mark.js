(function () {
  "use strict";

  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/[\s\-.,!?;:'"«»()…—–]/g, "");
  }

  function pickRandomError(errors, currentError) {
    const pool =
      errors.length > 1
        ? errors.filter(function (msg) {
            return msg !== currentError;
          })
        : errors;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getStageNumber() {
    return PATH_TO_STAGE[location.pathname] || null;
  }

  function hideElement(el) {
    el.classList.add("quest__hidden");
    el.setAttribute("hidden", "");
  }

  function showElement(el) {
    el.classList.remove("quest__hidden");
    el.removeAttribute("hidden");
  }

  function initStage(stage) {
    document.title = "Квест — этап " + stage.slug;

    var textEl = document.getElementById("quest-text");
    var formEl = document.getElementById("quest-form");
    var inputEl = document.getElementById("quest-input");
    var errorEl = document.getElementById("quest-error");
    var nextEl = document.getElementById("quest-next");
    var extraEl = document.getElementById("quest-extra");
    var extraWrap = document.getElementById("quest-extra-wrap");
    var finalEl = document.getElementById("quest-final");
    var finalWrap = document.getElementById("quest-final-wrap");
    var characterEl = document.getElementById("quest-character");

    textEl.textContent = stage.greeting;
    characterEl.src = "/assets/mark/" + stage.character + ".jpg";
    characterEl.onerror = function () {
      this.onerror = null;
      this.src = "/assets/mark/placeholder-character.svg";
    };
    characterEl.alt = stage.characterAlt;
    characterEl.dataset.character = stage.characterAlt;

    if (stage.showMap) {
      extraEl.src = "/assets/mark/map.jpg";
      extraEl.alt = "Карта Мародеров";
      showElement(extraWrap);
    } else {
      hideElement(extraWrap);
    }

    hideElement(errorEl);
    hideElement(nextEl);
    hideElement(finalWrap);
    showElement(formEl);

    var currentError = "";

    formEl.addEventListener("submit", function (event) {
      event.preventDefault();

      var normalizedInput = normalize(inputEl.value);
      var normalizedAnswer = normalize(stage.correctAnswer);

      if (normalizedInput === normalizedAnswer) {
        hideElement(formEl);
        hideElement(errorEl);
        hideElement(extraWrap);
        textEl.textContent = stage.successText;

        if (stage.isFinal) {
          finalEl.src = "/assets/mark/final-reward.jpg";
          finalEl.alt = "Главная награда";
          showElement(finalWrap);
        } else {
          nextEl.href = stage.nextUrl;
          showElement(nextEl);
        }
        return;
      }

      currentError = pickRandomError(stage.errors, currentError);
      errorEl.textContent = currentError;
      showElement(errorEl);
      inputEl.focus();
    });

    inputEl.focus();
  }

  function showNotFound() {
    var main = document.querySelector(".quest");
    if (!main) {
      return;
    }
    main.innerHTML =
      '<p class="quest__text">Этап не найден. Начни квест с <a class="quest__link" href="/mark/">первого этапа</a>.</p>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    var stageNumber = getStageNumber();
    if (!stageNumber) {
      showNotFound();
      return;
    }

    var stage = MARK_STAGES[stageNumber - 1];
    if (!stage) {
      showNotFound();
      return;
    }

    initStage(stage);
  });
})();
