$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("booklet") || "brand"; // default to brand
  const pdfMap = {
    brand: "src/Kosmik-Brand-Booklet-generic.pdf",
    brandaz: "src/Kosmik-Brand-Booklet-az.pdf",
    brandmo: "src/Kosmik-Brand-Booklet-mo.pdf",
    brandma: "src/Kosmik-Brand-Booklet-ma.pdf",
    brandnm: "src/Kosmik-Brand-Booklet-nm.pdf",
    regen: "src/Regenerative-Partner-Booklet.pdf",
  };

  const modal = $("#fb3d-lightbox");
  const container = modal.find(".mount-container");
  container.empty();

  const mainWrapper = $("<div class='main'></div>").appendTo(container);
  const flipbookInstance = $("<div class='flipbook-instance'></div>").appendTo(mainWrapper);

  $("body").addClass("fb3d-modal-shadow");
  modal.addClass("visible");

  flipbookInstance.FlipBook({
    pdf: pdfMap[type],
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
      return `${baseUrl}`;
    },
    ready: function () {
      console.log("Flipbook is ready");
    },
  });
});
