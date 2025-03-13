// Close Modal: Hides the modal when the close button is clicked
$(".modal .cmd-close").click(function (e) {
  e.preventDefault();
  $(".modal").modal("hide");
});

// Lightbox Modal for 3D Flipbook: Object to track active modal and element interaction
var fb3d = {
  activeModal: undefined, // Currently active modal
  capturedElement: undefined, // Element captured on mousedown
};

// Cache for storing loaded PDFs
var flipbookCache = {};

// Event handlers for modal interaction
(function () {
  // Helper function: Finds the parent node for the given element
  function findParent(parent, node) {
    while (parent && parent != node) {
      parent = parent.parentNode;
    }
    return parent;
  }

  // Capture the element on mousedown
  $("body").on("mousedown", function (e) {
    fb3d.capturedElement = e.target;
  });

  // Close the modal if the user clicks outside or on the close button
  $("body").on("click", function (e) {
    if (fb3d.activeModal && fb3d.capturedElement === e.target) {
      if (e.target === fb3d.activeModal[0] || findParent(e.target, fb3d.activeModal.find(".cmd-close")[0])) {
        e.preventDefault();
        fb3d.activeModal.fb3dModal("hide");
      }
    }
    delete fb3d.capturedElement;
  });
})();

// Close the modal when the Escape key is pressed
$("body").on("keydown", function (e) {
  if (fb3d.activeModal && e.keyCode === 27) {
    e.preventDefault();
    fb3d.activeModal.fb3dModal("hide");
  }
});

// 3D Modal Plugin Implementation: Adds show/hide functionality for the modal
$.fn.fb3dModal = function (cmd) {
  setTimeout(
    function () {
      // Show the modal
      function fb3dModalShow() {
        if (!this.hasClass("visible")) {
          $("body").addClass("fb3d-modal-shadow");
          this.addClass("visible");
          fb3d.activeModal = this;
          this.trigger("fb3d.modal.show");
        }
      }

      // Hide the modal
      function fb3dModalHide() {
        if (this.hasClass("visible")) {
          $("body").removeClass("fb3d-modal-shadow");
          this.removeClass("visible");
          fb3d.activeModal = undefined;
          this.trigger("fb3d.modal.hide");
        }
      }

      // Execute show or hide based on the command
      var mdls = this.filter(".fb3d-modal");
      switch (cmd) {
        case "show":
          fb3dModalShow.call(mdls);
          break;
        case "hide":
          fb3dModalHide.call(mdls);
          break;
      }
    }.bind(this),
    50
  );
};

// Helper function to get URL query parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Document ready: Initialize the gallery and lightbox functionality
$(document).ready(function () {
  const modal = $("#fb3d-lightbox");
  const container = modal.find(".mount-container");

  // Event listener for clicking on a thumbnail image in the gallery
  $(".gallery img").on("click", function () {
    const pdfUrl = $(this).data("pdf"); // Get PDF URL from data attribute
    const doc = $(this).attr("alt"); // Get alt attribute for caching
    const cachedInstance = flipbookCache[doc];

    if (cachedInstance) {
      container.children().hide(); // Hide all existing FlipBooks
      cachedInstance.show(); // Show the cached FlipBook instance
      modal.fb3dModal("show"); // Show the lightbox modal
      return;
    }

    // Hide all existing FlipBooks and create a new one
    container.children().hide();

    // Initialize FlipBook with the specified template and styles
    const newFlipbook = $("<div class='flipbook-instance'></div>").appendTo(container);
    newFlipbook.FlipBook({
      pdf: pdfUrl,
      propertiesCallback: function (props) {
        props.preloadPages = 20;
        props.renderInactivePagesOnMobile = true;
        props.renderWhileFlipping = true;
        return props;
      },
      controlsProps: {
        scale: {
          default: 0.9,
          min: 0.9,
          max: 0.9,
        },
      },
      template: {
        html: "templates/default-book-view.html",
        styles: ["css/kosmik-skin.css"],
        script: "js/default-book-view.js",
      },
      shareLinkBuilder: function (page) {
        const baseUrl = window.location.origin + window.location.pathname.split("?")[0];
        return `${baseUrl}?doc=${encodeURIComponent(doc)}`;
      },
    });

    // Cache the new FlipBook instance using the alt attribute
    flipbookCache[doc] = newFlipbook;
    modal.fb3dModal("show"); // Show the lightbox modal
  });

  // Automatically open the PDF if the URL contains the doc parameter
  const doc = getQueryParam("doc");
  if (doc) {
    const targetImg = $(`.gallery img[alt="${doc}"]`);
    if (targetImg.length > 0) {
      targetImg.trigger("click");
    }
  }

  // Close the lightbox on click of the close button
  $(".cmd-close").on("click", function () {
    $("#fb3d-lightbox").fb3dModal("hide");
  });
});
