jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
                .parent()
                .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
    });

    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });

    const search = document.getElementById("search");

    fetch("users.php").then(res => res.json()).then(json => {
        autocomplete(search, json);
    }).catch(err => {
        console.error(err);
    })


    function autocomplete(inp, arr) {
        var currentFocus;
        inp.addEventListener("input", function(e) {
          var val = this.value;
          closeAllLists();
          if (!val) return false;
          currentFocus = -1;
          val = val.toLowerCase();
          let a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          this.parentNode.appendChild(a);

          for (let i = 0; i < arr.length; i++) {
            if (arr[i].toLowerCase().includes(val)) {
                let title = arr[i];
                let b = document.createElement("DIV");
                b.innerHTML = "";
                let start = title.search(new RegExp(val, "i"));
                if (start > 0) b.innerHTML += title.substr(0, start);
                b.innerHTML +=
                    "<strong>" + title.substr(start, val.length) + "</strong>";
                if (start + val.length < title.length)
                    b.innerHTML += title.substr(
                    start + val.length,
                    title.length - val.length - start
                    );
                b.innerHTML = b.innerHTML;
            
              b.onclick = function f() {
                  window.location.href = "/~kariiv/prax4/user.php?u=" + arr[i];
              };
              a.appendChild(b);
            }
          }
        });
        inp.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
          } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
          } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
              if (x) x[currentFocus].click();
            }
          }
        });
    
        function addActive(x) {
          if (!x) return false;
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = x.length - 1;
          x[currentFocus].classList.add("autocomplete-active");
        }
    
        function removeActive(x) {
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
    
        function closeAllLists(elmnt) {
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }

        document.addEventListener("click", function(e) {
          closeAllLists(e.target);
        });
      }
});
