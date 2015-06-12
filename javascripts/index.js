$(document).ready(function () {
    setInterval(split, 1200);
    $(window).scroll(function () {
        var scroll = $(window).scrollTop(),
            height = $("#header").height() - 70,
            rate = 1 / height,
            opc = scroll * rate;
        $("#overlay").animate(
            {opacity: opc},
            1
        );
    });
//    
//    $("#container > a").hover(function() {
//        var width = $(this).find("img").css("width");
//        var height = $(this).find("img").css("height");
//        $(this).find("span").css("width",width).css("height",height);
//    });
    
    $("#Hmenu").mouseover(function () {
        $(this).attr("src", "/images/menu1.png");
    });
   
    $("#Hmenu").mouseout(function () {
        var HMDDBox =  $("#HMDDBox").css("display");
        if (HMDDBox == "none") {
            $(this).attr("src", "/images/menu.png");
        } else {
            $(this).attr("src", "/images/menu1.png");
        }
    });
    
    $("#Hmenu").click(function () {
        var HMDDBox =  $("#HMDDBox").css("display");
        if (HMDDBox == "none") {
            $("#Hmenu").attr("src", "/images/menu1.png");
            $("#HMDDBox").css("display", "block");
            $("#HMDD").animate(
                {top: 0},
                600,
                'easeOutBack'
            );
        } else {
            $("#HMDD").animate(
                {top: -270},
                600,
                'easeInBack',
                function () {
                    $("#HMDDBox").css("display", "none");
                    $("#Hmenu").attr("src", "/images/menu.png");
                }
            );
        }
    });
});

function split() {
    $("#split").animate(
        {opacity: 0},
        300,
        'linear'
    );
    $("#split").animate(
        {opacity: 1},
        300,
        'easeInExpo'
    );
}