    $.holdReady(true);
    var db = {};
    var d0 = $.getJSON("json/excel/building_data.json",function(data){
            db["manufactformulas"] = data.manufactFormulas;
        });
    var d1 = $.getJSON("json/excel/building_data.json",function(data){
            db["workshopformulas"] = data.workshopFormulas;
        });
    var d2 = $.getJSON("json/excel/character_table.json",function(data){
            db["chars"] = data;
        });
    var d3 = $.getJSON("json/excel/item_table.json",function(data){
            db["items"] = data.items;
        });
    var d4 = $.getJSON("json/tl-akhr.json",function(data){
            db["chars2"] = data;
        });
    var d5 = $.getJSON("json/tl-type.json",function(data){
            db["classes"] = data;
        });
    var d6 = $.getJSON("json/tl-tags.json",function(data){
            db["tags"] = data;
        });
    var d7 = $.getJSON("json/tl-item.json",function(data){
            db["itemstl"] = data;
        });
    var d8 = $.getJSON("json/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d9 = $.getJSON("json/excel/skin_table.json",function(data){
            db["skintable"] = data;
        });
    var d10 = $.getJSON("json/tl-gender.json",function(data){
            db["gender"] = data;
        });
    var d11 = $.getJSON("json/excel/skill_table.json",function(data){
            db["skills"] = data;
        });
    var d12 = $.getJSON("json/ace/tl-skills.json",function(data){
            db["skillsTL"] = data;
        });
    var d13 = $.getJSON("json/excel/range_table.json",function(data){
            db["range"] = data;
        });
    var d14 = $.getJSON("json/tl-attacktype.json",function(data){
            db["attacktype"] = data;
        });
    var d15 = $.getJSON("json/tl-unreadablename.json",function(data){
            db["unreadNameTL"] = data;
        });
    var d16 = $.getJSON("json/tl-potential.json",function(data){
            db["potentialTL"] = data;
        });
    var d17 = $.getJSON("json/ace/tl-talents.json",function(data){
            db["talentsTL"] = data;
        });
    var d18 = $.getJSON("json/excel/handbook_info_table.json",function(data){
            db["handbookInfo"] = data;
        });
    var d19 = $.getJSON("json/tl-va.json",function(data){
        db["vaTL"] = data;
    });
    var d20 = $.getJSON("json/tl-storytext.json",function(data){
        db["storytextTL"] = data;
    });
    var d21 = $.getJSON("json/tl-charastory.json",function(data){
        db["charastoryTL"] = data;
    });  
    var d22 = $.getJSON("json/excel/charword_table.json",function(data){
        db["charword"] = data;
    });  
    var d23 = $.getJSON("json/tl-voiceline.json",function(data){
        db["voicelineTL"] = data;
    });  
    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14,d15,d16,d17,d18,d19,d20,d21,d22,d23).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var selectedOP;
    var lefthand;
    var opdataFull = {};
    var curpath;
    var opapp;

    $(document).ready(function(){
        $('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $(window).click(function() {
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
        });
        $('#operatorsResult').click(function(event){
            event.stopPropagation();
        });
        $('#opBrowseButton').click(function(event){
            event.stopPropagation();
        });
        $('#opname').click(function(event){
            event.stopPropagation();
        });
        $('#lefthandtoggle').click(function(event){
            if(lefthand=="true")
                lefthand = "false"
            else 
                lefthand = "true"
            localStorage.setItem("lefthand",lefthand)
            // console.log(lefthand)
            location.reload()
        })
        if(typeof localStorage.lefthand ==="undefined"){
            localStorage.setItem("leftHand","false")
            lefthand = "false"

        }else{
            lefthand = localStorage.lefthand
        }
        if(lefthand=="true")
        $('#lefthandtoggle').css("background-color","#0077AA")
        else 
        $('#lefthandtoggle').css("background-color","#222")

        $('#opname').bind("enterKey",function(e){
            // console.log()
            populateOperators($('#opname').val(),true)
         });
         $('#opname').keyup(function(e){
             if(e.keyCode == 13)
             {
                 $(this).trigger("enterKey");
             }
         });
        
        if(typeof localStorage.gameRegion === "undefined" || localStorage.gameRegion == ""|| localStorage.webLang == ""){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";

            var vars = getUrlVars();
            if(typeof vars.opname != "undefined"){
                // console.log("TEST1")
            }
        } else {
            console.log(localStorage.webLang);
            reg = localStorage.gameRegion;
            lang = localStorage.webLang;
        }
        if(typeof localStorage.selectedOPDetails === "undefined" || localStorage.selectedOPDetails == ""){
            console.log("selected OP undefined");
            var vars = getUrlVars();
            if(typeof vars.opname != "undefined"){
                vars.opname = decodeURIComponent(vars.opname);
                console.log(vars.opname);
                var char = query(db.chars,"appellation",vars.opname,true,true);
                var opname;
                $.each(char,function(key,v){
                    opname = v.name;
                });
                selectOperator(opname);
            } else {
                localStorage.setItem("selectedOP","");
            }
        } else {
            console.log("selected OP defined");
            var curpath = window.location.search.split("?");
            // console.log(curpath)
            // curpath.forEach(element => {
                
            // });
            if(typeof curpath[1] != "undefined"){
                var variables = curpath[1].split("?");
                var char = {};
                $.each(variables,function(_,v){
                    var subvar = v.split("=");
                    if(subvar[0] == "opname"){
                        var opname = decodeURIComponent(subvar[1]);
                        console.log(opname)
                        var unreadable = query(db.unreadNameTL,"name_en",opname.replace(/_/g," "))
                        console.log(unreadable)
                        var correctname = (unreadable?unreadable.name:opname.replace(/_/g," "))
                        console.log(correctname)
                        char = query(db.chars,"appellation",correctname,true,true);
                        
                    }
                });
                var opname;
                $.each(char,function(key,v){
                    opname = v.name;
                    var unreadable = query(db.unreadNameTL,"name",v.appellation)
                    var correctname = (unreadable?unreadable.name_en.replace(/ /g,"_"):v.appellation.replace(/ /g,"_"))
                    opapp = correctname
                })
                
            } else {
                selectedOP = localStorage.selectedOPDetails;
                var opname = db.chars[selectedOP].name;
            }
            
            selectOperator(opname);
           
            curpath.forEach(element => {
                if(element.includes("story=")){
                    $('#opstory').modal('show')
                }else if(element.includes("voice=")){
                    $('#opaudio').modal('show')
                }
            });
        }
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function() {
                var curpath = window.location.search.split("?");
                console.log(opapp)
                console.log(curpath)
                if(curpath[1]){
                    var historyopname = curpath[1].split("=")
                    if(historyopname&&historyopname[1]){
                        if(historyopname[1]!=opapp){
                            var unreadable = query(db.unreadNameTL,"name_en",historyopname[1].replace(/_/g," "))
                            var correctname = (unreadable?unreadable.name:historyopname[1].replace(/_/g," "))
                            console.log(correctname)
                            var char = query(db.chars,"appellation",correctname,true,true);
                            // console.log()
                            selectOperator(char[Object.keys(char)].name)
                        }
                    }
                }
                curpath.forEach(element => {
                    if(element.includes("story=")){
                        $('#opstory').modal('show')
                        $('#opaudio').modal('hide')
                    }else if(element.includes("voice=")){
                        $('#opaudio').modal('show')
                        $('#opstory').modal('hide')
                    }else{
                        $('#opstory').modal('hide')
                        $('#opaudio').modal('hide')
                    }
                });
            //   alert('Back button was pressed.');
            });
        
        }

        $('#opstory').on('shown.bs.modal', function(){
            var curpath = window.location.search.split("?");
            history.pushState(null, '', window.location.pathname+'?'+curpath[1]+'?story=0'); 
        });
        $('#opstory').on('hidden.bs.modal', function(){
            var curpath = window.location.search.split("?");
            history.pushState(null, '', window.location.pathname+'?'+curpath[1]); 
        });
        $('#opaudio').on('shown.bs.modal', function(){
            var curpath = window.location.search.split("?");
            history.pushState(null, '', window.location.pathname+'?'+curpath[1]+'?voice=0'); 
        });
        $('#opaudio').on('hidden.bs.modal', function(){
            var curpath = window.location.search.split("?");
            history.pushState(null, '', window.location.pathname+'?'+curpath[1]); 
        });

        // console.log("TEST")
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');

        //getSkillDesc('skchr_amiya_2',0);
        window.onhashchange = function() {
            console.log(window.location.pathname)
        }
    });

    $.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });

   
    function clickBtnClear(){
        $("#chara-detail-container").hide();
        $("#elite-sidenav").html("");
        $("#tabs-opCG").html("");
        $("#elite-topnav").html("");
        $("#tabs-opData").html("");
        $("#op-taglist").html("");
        $("#opname").val("");
        $('#operatorsResult').html("");
        $('#operatorsResult').hide();
        localStorage.selectedOPDetails = "";
        history.pushState(null, '', window.location.pathname); 
    }

    // function populateOperators(el,isenter = false){
    //     let inputs
    //     if(isenter)
    //         inputs = el
    //     else
    //         inputs = el.value

    //     $.each(db.chars,function(_,char){
    //         var unreadable = query(db.unreadNameTL,"name",char.appellation)
    //         console.log(char.appellation)
    //         console.log(unreadable)
    //     })
        
    // }
    function populateOperators(el,isenter = false){
        // console.log(el)
        let inputs
        if(isenter)
            inputs = el
        else
            inputs = el.value
        if(($('#operatorsResult').css("display") == "block") && el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#operatorsResult').hide();
            return;
        }
        if(el.value != ""||el=="Browse"||isenter&&el){
            var result = [];
            $.each(db.chars2,function(_,char){
                var languages = ['cn','en','jp','kr'];
                var found = false;
                if(el=="Browse"){
                    found=true;
                }else{
                    for (var i = 0; i < languages.length; i++) {
                        var charname = eval('char.name_'+languages[i]).toUpperCase();
                        var unreadable = query(db.unreadNameTL,"name",char.name_en)
                        var input = inputs.toUpperCase();
                        var search = (unreadable?unreadable.name_en.toUpperCase().search(input):charname.search(input));
                        if(search != -1){
                            found = true;
                            break;
                        };
                    }
                }
                if(found){
                    // console.log(char)
                    var name_cn = char.name_cn;
                    var name = eval('char.name_'+reg);
                    var unreadable = query(db.unreadNameTL,"name",char.name_en).name_en
                    var nameTL = eval('char.name_'+lang);
                    var img_name = query(db.chars,"name",char.name_cn,true,true); 
                    // console.log(Object.keys(img_name))
                    var rarity = img_name[Object.keys(img_name)] ? img_name[Object.keys(img_name)].rarity + 1 : 0;
                    // console.log(rarity);
                    if(rarity!=0)
                    result.push({'name':name,'name_cn':name_cn,'name_readable':unreadable,'nameTL':nameTL,'img_name':Object.keys(img_name),rarity});
                }
            });
            // console.log(result)
            result.sort((a,b)=> b.rarity-a.rarity)
            if(result.length > 0){
                if(isenter){
                    $('#operatorsResult').hide();
                    selectOperator(result[0].name_cn)
                    return
                }
                $('#operatorsResult').html("");
                $('#operatorsResult').show();
                for (var i = 0; i < result.length; i++) {

                    //test for audio
                    // var opdata = query(db.chars2,"name_cn",result[i].name);
                    // var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
                    // // console.log(opdata2)
                    // $.each(opdata2,function(key,v){
                    //     v['id'] = key;
                    //     // console.log(v);
                    //     opdataFull = v;
                    //     opKey = key;
                    //     return false
                    // });
                    // AudioText(opdataFull)

                    let image = `<img style="height:40px;padding:2px" src="./img/avatars/${result[i].img_name}_1.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img style="height:70px;padding:2px" src="./img/avatars/${result[i].img_name}_1.png">  `
                        $("#operatorsResult").css("max-width","100vw");
                        $("#operatorsResult").append(
                                "<li class=\"col-2 col-sm-1 ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"display:inline-block;cursor: pointer;width:75px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px\" onclick=\"selectOperator('"+result[i].name_cn+"')\">"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+image+"</div>"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+`${result[i].name_readable?`[${result[i].name_readable}]`:""}`+result[i].nameTL+"</div>"
                                +"</li>");
                    }else{
                        $("#operatorsResult").css("max-width","290px");
                        $("#operatorsResult").append(`<li class=" ak-shadow-small ak-rare-${result[i].rarity}"style="width:100%;cursor: pointer;margin-bottom:2px" onclick="selectOperator('${result[i].name_cn}')">${image} ${result[i].name_readable?`[${result[i].name_readable}]`:""} ${result[i].nameTL} (${result[i].name})</li>`);
                    }
                }
            }
            // console.log( $("#operatorsResult")  )
            // $('#operatorsResult').show();
        } else {
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
        }
    }
    function openOPZOOMmodal(){
        $('#opzoom').modal();
        var image = $('#tabs-opCG').children('.active').children('img').attr('src');
        ChangeZoomChara('',image);
    }
    function ChangeZoomChara(skinName, src=''){
        if(skinName != ''){
            $("#charazoom").attr("src","img/characters/"+skinName+".png");
        } else {
            $("#charazoom").attr("src",src);
        }
        $('#charazoom').modal('handleUpdate')
    }
    function selectOperator(opname){
        
        if(opname != ""){
            $("#chara-detail-container").show();
            console.log("SELECT OPERATOR");
            console.log(opname);   
            $("#opname").val("");
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
            var opdata = query(db.chars2,"name_cn",opname);
            var opclass = query(db.classes,"type_cn",opdata.type);
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
            
            //test
            // var charalist = []
            // $.each(db.chars,(key,chara) => {
            //     charalist.push(`${chara.appellation},${chara.displayLogo},${key.split("_")[1]},${key}_1`)
            // });
            // console.log(charalist.join("\n"))
            //
            var opKey =""
            $.each(opdata2,function(key,v){
                v['id'] = key;
                // console.log(v);
                opdataFull = v;
                opKey = key;
                localStorage.selectedOPDetails = key;
                return false
            });
            
            var curpath = window.location.pathname
            var curpath2 = window.location.search.split('?')
            // console.log(curpath2)
            var unreadable = query(db.unreadNameTL,"name",opdataFull.appellation)
            var correctname = (unreadable?unreadable.name_en.replace(/ /g,"_"):opdataFull.appellation.replace(/ /g,"_"))
            opapp = correctname
            if(curpath2[1]&&curpath2[1].includes("opname="+correctname)){
                
            }else{
                history.pushState(null, '', curpath+'?opname='+correctname); 
            }

            // use opdata to get the operator data based on tl-akhr.json
            // use opdataFull to get the operator data based on character_table.json

            // Get operator elite skins
            var skinList = db.skintable.buildinEvolveMap[opdataFull.id];
            var extraSkin = []
            Object.keys(db.skintable.charSkins).forEach(element => {
                // console.log(element)
                // console.log()
                if(element.startsWith(opdataFull.id)){
                    if(db.skintable.charSkins[element].displaySkin.skinName){
                        extraSkin.push(db.skintable.charSkins[element])
                    }
                    
                }
            });
            // console.log(extraSkin)
            // console.log(skinList);
            $("#op-faction").attr("src","img/factions/"+opdataFull.displayLogo.toLowerCase()+".png");

            var tabbtn = [];
            var tabbtn2 = [];
            var tabcontent = [];
            var tabcontent2 = [];
            var zoombtn = [];
            
            $("#elite-sidenav").html("");
            $("#tabs-opCG").html("");
            $("#elite-topnav").html("");
            $("#tabs-opData").html("");
            $("#op-taglist").html("");

            for (var i = 0; i < opdataFull.phases.length; i++) {
                var l = opdataFull.phases.length;
                if(i == 0){
                    if(l == 1){
                        tabbtn[l] = $("<li class='nav-item'><button class='btn tabbing-btns active'>"
                            + "<img src='img/ui/elite/0-s.png' data-toggle='pill' href='#opCG_0_tab'></button></li>");
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' href='#elite_0_tab'>Non-Elite</a></li>");
                    } else {
                        tabbtn[l] = $("<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-bottom active' data-toggle='pill' href='#opCG_"+i+"_tab'>"
                                            + "<img src='img/ui/elite/0-s.png'></button></li>");
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' href='#elite_"+i+"_tab'>Non-Elite</a></li>");
                    }
                } else if( i == l-1 ){
                    tabbtn[0] = $("<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-top' data-toggle='pill' href='#opCG_"+i+"_tab'>"
                                            + "<img src='img/ui/elite/"+i+"-s.png'></button></li>");
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' href='#elite_"+i+"_tab'>Elite "+i+"</a></li>");
                } else {
                    tabbtn[l-i] = $("<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-middle' data-toggle='pill' href='#opCG_"+i+"_tab'>"
                                            + "<img src='img/ui/elite/"+i+"-s.png'></button></li>");
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' href='#elite_"+i+"_tab'>Elite "+i+"</a></li>");
                }
                
                var skindata;
                if(!(skinList[i] in db.skintable.charSkins)){
                    skindata = db.skintable.charSkins[skinList[i-1]];
                } else {
                    skindata = db.skintable.charSkins[skinList[i]];
                }
                zoombtn.push($(`<button class="btn ak-c-black btn-dark" style="margin:2px;padding:2px; height: 50px; width: 50px;" onclick="ChangeZoomChara('${skindata.portraitId}')"><img src='img/ui/elite/${i}-s.png'></button>`))
                if(i == 0){
                    $("#charazoom").attr("src","img/characters/"+skindata.portraitId+".png");
                    $('#charazoom').modal('handleUpdate')
                    
                    tabcontent.push($("<div class='tab-pane container active' id='opCG_0_tab'>"
                        +"<img class='chara-image' src='img/characters/"+skindata.portraitId+".png'>"
                        +"</div>"));
                } else {
                    tabcontent.push($("<div class='tab-pane container fade' id='opCG_"+i+"_tab'>"
                        +"<img class='chara-image' src='img/characters/"+skindata.portraitId+".png'>"
                        +"</div>"));
                }
                
                var elitehtml = getEliteHTML(i,opdataFull);
                tabcontent2.push(elitehtml);
            }


            if(extraSkin.length>0){
                let dropdowntab = []
                
                for(var i=0;i<extraSkin.length;i++){
                    zoombtn.push($(`<button class="btn ak-c-black btn-dark" style="margin:2px;padding:2px; height: 50px; width: 50px;" onclick="ChangeZoomChara('${encodeURIComponent(extraSkin[i].portraitId)}')">
                    <img style="max-width:40px;max-height:40px;" src='img/skingroups/${encodeURIComponent(extraSkin[i].displaySkin.skinGroupId)}.png'>
                    </button>`))

                    tabcontent.push($(`
                    <div class='tab-pane container fade' id='opCG_S${i}_tab'>
                    <img class='chara-image' src='img/characters/${encodeURIComponent(extraSkin[i].portraitId)}.png'>
                    </div>
                    `))
                    dropdowntab.push(`<li class='nav-item' ${i==0?`style="margin-top:5px"`:""}><a class="btn tabbing-btns" data-toggle='pill' href='#opCG_S${i}_tab'>
                    <div style="display:inline-block;height:100%;vertical-align:middle;"></div>
                    <img class='skinimage' style="max-width: 40px;max-height: 40px;margin-left:-5px;" src='img/skingroups/${encodeURIComponent(extraSkin[i].displaySkin.skinGroupId)}.png'>
                    </a></li>`)
                }
                
                tabbtn.push(`
         
                    ${dropdowntab.join("")}
                    
                `)
                
            }
            tabbtn.push($(`<button type="button" class="btn tabbing-btns tabbing-btns-top ak-btn" style="width:50px;height:50px;margin-top:10px;" onclick="openOPZOOMmodal()"><span style="font-size: 1.5em" class="fa fa-search-plus"></span></button>`))
            tabbtn.push($(`<button type="button" class="btn tabbing-btns tabbing-btns-middle ak-btn" style="width:50px;height:50px" data-toggle="modal" data-target="#opstory">
            <div>
                <img src="./img/ui/story/profile.png" style="max-width:40px;max-height:40px">
                <div class="btn-story-header" style="border-radius:0px">Profile</div>
            </div>
            </button>`))

            tabbtn.push($(`<button type="button" class="btn tabbing-btns tabbing-btns-bottom ak-btn" style="width:50px;height:50px" data-toggle="modal" data-target="#opaudio" >
            <div>
                <img src="./img/ui/story/audio.png" style="max-width:40px;max-height:40px">
                <div class="btn-story-header">Audio</div>
            </div>
            </button>`))

            $("#charazoom-button").html(zoombtn)
            $("#elite-sidenav").html(tabbtn);
            $("#tabs-opCG").html(tabcontent);
            $("#elite-topnav").html(tabbtn2);
            $("#tabs-opData").html(tabcontent2);

            for (var i = 0; i < opdataFull.phases.length; i++) {
                EliteStatsDisplay(1,i);
            }

            var unreadable = query(db.unreadNameTL,"name",opdata.name_en).name_en
            $("#op-nameTL").html(eval("opdata.name_"+lang));
            $("#op-nameREG").html("["+eval("opdata.name_"+reg)+"]");
            $("#op-displaynum").html(`${opdataFull.displayNumber} | ${opdataFull.id.split("_")[1]}`)
            if(unreadable){
                $("#op-nameRead").html(`[ ${unreadable} ]`);
            }else{
                $("#op-nameRead").html("")
            }
            var gender = query(db.gender,"sex_cn",opdata.sex);
            
            $("#op-gender").html(titledMaker(eval("gender.sex_"+lang),`Gender`))
            var position = query(db.tags,"tag_cn",opdataFull.position);
            $("#op-position").html(titledMaker(eval("position.tag_"+lang),`Position`))

            var type = query(db.classes,"type_data",opdataFull.profession);
            $("#op-classImage").attr("src","img/classes/black/icon_profession_"+eval("type.type_"+lang).toLowerCase()+"_large.png")
            $("#op-className").html(eval("type.type_"+lang))
            var attackType = getSpeciality(opdataFull.description,opdataFull)
            
            $("#op-atktype").html(attackType)
            $("#op-rarity").html("");
            $("#op-rarity").attr("class","op-rarity-"+(opdataFull.rarity+1))
            
            $("#op-trust").html(GetTrust(opdataFull))

            var potentials = GetPotential(opdataFull)
            var potentialist = []
            potentialist.push(`<div style="height:4px"></div>`)
            for(i=0;i<potentials.length;i++){
                potentialist.push(`<div style="font-size:13px;padding:1px;margin-left:-6px;color:#DDD;vertical-align:bottom"><img src="./img/ui/potential/${i+2}.png" style="margin-top:-4px;width:20px;background:#222;border-radius:25%;padding:2px"> ${potentials[i]}</div>`)
            }
            // console.log(potentials)
            $("#op-talentlist").html(GetTalent(opKey,opdataFull))
            if(potentials.length>0){
                $("#op-potentialist").html(titledMaker(potentialist.join(""),"Potentials"))
            }else{
                $("#op-potentialist").html("")
            }
            for (var i = 0; i < (opdataFull.rarity+1); i++) {
                $("#op-rarity").append("<i class='fa fa-star'></i>");
            }
            var tags_html = [];
            $.each(opdataFull.tagList,function(_,v){
                var tag = query(db.tags,"tag_cn",v);
                if(tag){
                    var tagReg = eval('tag.tag_'+reg);
                    var tagTL = eval('tag.tag_'+lang);
                    tags_html.push("<li style=\"list-style-type:none; padding-bottom: 10px;\"><button readonly type=\"button\" class=\"btn btn-sm ak-shadow-small ak-btn btn-secondary btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+ tagReg +"\">" +
                            (tagReg == tagTL ? "" : '<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">'+tagReg+'</a>') +tagTL + "</button></li>");
                }
            });
            
            $("#op-taglist").append(tags_html);
            //Story

            GetStory(opdataFull)
            GetAudio(opdataFull)
            ///////////////////////////////////////////////// SKILLS SECTION //////////////////////////////////////////////////

            $("#skill-tabs").html("");
            $("#skill-contents").html("");
            $.each(opdataFull.skills,function(i,v){
                var maxSkillLevel = opdataFull.skills[i].levelUpCostCond.length;
                var skillId = opdataFull.skills[i].skillId;
                var skillData = db.skills[skillId];
                var skillname
                var tables = "";
                var grid = ""
                // console.log(skillData)
                // var materialList2 = []
                $.each(skillData.levels,function(i2,v2){
                    // console.log(v2['spData'].spCost);
                    var currSkill = skillData.levels[i2]
                    skillname = db.skillsTL[skillId]?db.skillsTL[skillId].name:currSkill.name;
                    var skilldesc = getSkillDesc(skillId,i2);
                    var skillMat = GetSkillCost(i2,i,opdataFull)
                    var force
                    var materialist = []
                    skillMat.forEach(mat => {
                        materialist.push(CreateMaterial(mat.id,mat.count))
                    });
                    var materialHtml =``
                    if(i2>=7){
                        var time = opdataFull.skills[i].levelUpCostCond[i2-7].lvlUpTime
                        var condLeveling = opdataFull.skills[i].levelUpCostCond[i2-7].unlockCond
                        var condUnlocking = opdataFull.skills[i].unlockCond
                        var phase = Math.max(condLeveling.phase,condUnlocking.phase)
                        var level = Math.max(condLeveling.level,condUnlocking.level)
                        materialHtml = `
                        <div style="text-align:center;background:#222">${(i2==0?"Unlock":"Rank Up")} Requirements</div>
                        <div style="margin-top:15px">
                        ${titledMaker((phase>0?"Elite "+phase+" ":"")+(level>0?"Level "+level:""),"Level Required")}
                        ${titledMaker(time/60/60+" Hour","Time Required")}
                        </div>
                        `+(materialist.length>0?materialist.join(""):"")
                    }else{
                        var condLeveling = (opdataFull.allSkillLvlup[i2-1]?opdataFull.allSkillLvlup[i2-1].unlockCond:{phase:0,level:0})
                        var condUnlocking = opdataFull.skills[i].unlockCond
                        var phase = Math.max(condLeveling.phase,condUnlocking.phase)
                        var level = Math.max(condLeveling.level,condUnlocking.level)
                        materialHtml = `
                        <div style="text-align:center;background:#222">${(i2==0?"Unlock":"Rank Up")} Requirements</div>
                        <div style="margin-top:15px">
                        ${titledMaker((phase>0?"Elite "+phase+" ":"")+(level>0?"Level "+level:""),"Level Required")}
                        </div>
                        `+(materialist.length>0?materialist.join(""):"")
                    }
                    
                    if(v2.rangeId)grid = rangeMaker(v2.rangeId)
                    
                    var spType = (v2.spData.spType)
                    // console.log(spType)
                    var spTypeHtml = ""
                    switch (spType){
                        case 1:spTypeHtml = "Per second";break;
                        case 2:spTypeHtml = "Attacking Enemy";break;
                        case 4:spTypeHtml = "Getting Hit";break;
                        case 8:spTypeHtml = "Always On";break;
                        default:spTypeHtml = spType;break;
                    }
                    var spDuration= (v2.duration==0?"Instant Attack":v2.duration + " Seconds")
                    var spDurationName = (v2.duration==0?"":"Duration")

                    skillData.levels[i2].blackboard.forEach(skillinfo => {
                        if(skillinfo.key=="force") force= skillinfo.value
                        if(v2.duration==-1){
                            if(skillinfo.key =="duration"){
                                spDuration = skillinfo.value;
                                spDurationName = "Target Effect Duration"
                            }
                        }
                        if(skillinfo.key=="ability_range_forward_extend"){
                            grid = rangeMaker(opdataFull.phases[0].rangeId,true,skillinfo.value)
                        }
                    });
                    switch (force) {
                        case 0: force = "Small [0]";break;
                        case 1: force = "Medium [1]";break;
                        case 2: force = "Large [2]";break;
                        case 3: force = "Huge [3]";break;
                    }
                    // console.log(currSkill)
                    var skillType = ""
                    switch(currSkill.skillType){
                        case 0 : skillType = "Passive" ;break;
                        case 1 : skillType = "Manual Trigger" ;break;
                        case 2 : skillType = "Auto Trigger" ;break;
                    }
                    var skillType = titledMaker(skillType,"Skill Activation")
                    var spTypeHtml = (currSkill.skillType==0?"":titledMaker(spTypeHtml,"SP Charge Type",`spType-${spType}`))
                    // console.log(materialList2)
                    // console.log(parseInt(v2.duration)>0)
                    //skilltype 
                    //0 = on deploy
                    //1 = manual 
                    //2 = auto
                    tables +=`<table id='skill${i}level${i2}stats' class='${lefthand=="true"?"left-hand":""} skillstats ${(i2!=0 ? '' : 'active')}'>
                             <tr >
                                <td colspan='${grid?5:4}'>${spTypeHtml}${skillType}${titledMaker(spDuration,spDurationName)}</td>
                            </tr>
                            <tr style="height:10px"></tr>
                            <tr>
                                <td colspan='${grid?3:2}' class='skilldesc'>${skilldesc}</td>
                            </tr>
                            <tr style="height:10px"></tr>
                            `       
                    if(grid){
                        tables +=            "<tr>"
                                +               "<td rowspan=2>"+(grid?grid:"")+"</td>"
                                +                `<td>${titledMaker(v2['spData'].spCost,"SP Cost")}</td>`
                                +            "</tr>"
                                +             "<tr>"
                                +                   `<td>${titledMaker(v2['spData'].initSp,"Initial SP")}</td>`
                                +               "</tr>"
                                +             "<tr><td>"+(force!=undefined?`${titledMaker(force,"Force Level")}`: "")+"</td></tr>"
                                +               "<tr><td colspan=3>"+ materialHtml + "</td><tr>"
                                +        "</table>";   
                    } else {
                        tables +=           "<tr style=\"height:10px\"></tr>"
                                +            "<tr>"
                                +                `<td>${titledMaker(v2['spData'].spCost,"SP Cost")}${titledMaker(v2['spData'].initSp,"Initial SP")}</td>`
                                +            "</tr>"
                                +             (force!=undefined?`<tr><td>${titledMaker(force,"Force Level")}</td></tr>`: "")
                                + "<tr><td colspan=4><div style='height:10px'></div>"+ materialHtml + "</td><tr>"
                                +        "</table>";
                    }
                })

                if(skillData.iconId == null){
                    var skillIcon = skillId;
                } else {
                    var skillIcon = skillData.iconId;
                }

                var tabItem = $("<li class='nav-item'>"
                                +    "<button class='btn tabbing-btns horiz-small nav-link "+(i!=0 ? '' : 'active')+"' data-toggle='pill' href='#skill"+i+"'><p>Skill "+(i+1)+"</p></button>"
                                +"</li>");
                var tabContents = $("<div class='tab-pane container clickthrough "+(i!=0 ? 'fade' : 'active')+"' id='skill"+i+"'>"
                                        +    "<div class='small-container ak-shadow' style='margin-top: 50px;'>"
                                        +        "<p class='large-text'>Skill "+(i+1)+"</p>"
                                        +        "<span class='custom-span skillname'>"+skillname+"</span>"
                                        +        "<div class='topright'>"
                                        +            "<div style='padding: 15px;'>"
                                        +                "<img class='ak-shadow skill-image' id='skill"+i+"image' src='img/skills/skill_icon_"+skillIcon+".png' style='width: 100%;'>"
                                        +            "</div>"
                                        +        "</div>"
                                        +        "<button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#skill"+i+"StatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                                        +    "</div>"
                                        +    "<div id='skill"+i+"StatsCollapsible' class='collapse collapsible notclickthrough ak-shadow collapse show' >"
                                        +       `<input type='range' value='1' min='1' max=${skillData.levels.length} name='skillLevel' id='skill${i}Level' oninput='changeSkillLevel(this,${i})'style="margin-top:20px;" class='${lefthand=="true"?"lefthandskillLevelInput":""} skillLevelInput'>`
                                        +        `<div class='${lefthand=="true"?"lefthandskillleveldisplaycontainer":""} skillleveldisplaycontainer'><span class="custom-span ak-btn btn btn-sm ak-c-black" id='skill${i}LevelDisplay'>${SkillRankDisplay(1)}</span></div>`
                                        // +        `<div style="position:absolute"style="bottom:0px;right:0px">Level</div>`
                                        +        tables
                                        +    "</div>"
                                        +"</div>");
                $("#skill-tabs").append(tabItem);
                $("#skill-contents").append(tabContents);
            });
        }
    }

    function getEliteHTML(i, opdataFull){
        var container = $("<div class='tab-pane container "+(i!=0 ? 'fade' : 'active')+"' id='elite_"+i+"_tab'></div>");

        var stats = $("<div class='small-container ak-shadow clickthrough'>"
                        +   "<p class='large-text'>Base</p>"
                        +   "<span class='custom-span'>Stats</span>"
                        +   "<div class='topright maxlevel'>"
                        +       "<span class='custom-span maxleveltext'>Max Level</span>"
                        +       "<span class='custom-span leveltext'>"+opdataFull.phases[i].maxLevel+"</span>"
                        +       "<div class='ring'>"
                        +           "<div class='back ak-shadow'></div>"
                        +           "<div class='back-centre'></div>"
                        +       "</div>"
                        +   "</div>"
                        +"<button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#elite"+i+"StatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                        +"</div>");

        var statsCollapsible = $("<div id='elite"+i+"StatsCollapsible' class='collapse collapsible eliteStatsContainer ak-shadow collapse show'></div>");
        var eliteCost = GetEliteCost(i,opdataFull)
        var materialist = []
        
        if(eliteCost){
            eliteCost.forEach(materials => {
                materialist.push(CreateMaterial(materials.id,materials.count))
            });
            // console.log(materialist)
        }
        var materialHtml =''
        if(materialist.length>0){
            materialHtml=`
            <div style="text-align:center;background:#222">Elite Requirements</div>
            <div style="text-align:center">${materialist.join("")}</div>`
        }
        var keyframes = [];
        $.each(opdataFull.phases[i].attributesKeyFrames,function(j,v){
            keyframes[j] = v;
        });
        // console.log(keyframes);
        // var statsLevelHeader = $(`<span class='stat-level-header ${lefthand=="true"?"lefthand-stat-level-header":"righthand-stat-level-header"} ' style=''>Level</span>`)
        // var statsLevelSlider = $(`<input type='range' value='1' min='1' max='${keyframes[1].level}' name='levelStats' id='elite${i}LevelSlider' oninput='changeEliteLevel(this,${i},${keyframes[1].level})' style='margin-top:20px;width:60%;' class='statlevelInput ${lefthand=="true"?"lefthand-statlevelInput":"righthand-statlevelInput"}'></input>`);
        // var statsLevelDisplay = $(`<div class='form-group stat-input ${lefthand=="true"?"lefthand-stat-input":"righthand-stat-input"}' style='display:inline-block;vertical-align:middle;'><input class='form-control' id='elite${i}LevelDisplay' onchange='changeEliteLevel(this,${i},${keyframes[1].level})' style='line-height:1.1' type='number' value='1' min='1' max='${keyframes[1].level}'></div>`)
        
        var statsLevelAll = $(`
        <div style='text-align:center'>
        <span class='stat-level-header ${lefthand=="true"?"lefthand-stat-level-header":"righthand-stat-level-header"} ' style=''>Level</span>
        <input type='range' value='1' min='1' max='${keyframes[1].level}' name='levelStats' id='elite${i}LevelSlider' oninput='changeEliteLevel(this,${i},${keyframes[1].level})' style='margin-top:20px;width:60%;' class='statlevelInput ${lefthand=="true"?"lefthand-statlevelInput":"righthand-statlevelInput"}'></input>
        <div class='form-group stat-input ${lefthand=="true"?"lefthand-stat-input":"righthand-stat-input"}' style='display:inline-block;vertical-align:middle;'><input class='form-control' id='elite${i}LevelDisplay' onchange='changeEliteLevel(this,${i},${keyframes[1].level})' style='line-height:1.1' type='number' value='1' min='1' max='${keyframes[1].level}'></div>
        </div>
        `)
        
        var statsTable = $(`
        <div id='elite${i}Stats' class='${lefthand=="true"?"left-hand":"right-hand"} statlevelcontainer'>
            <table id='elite${i}StatsTable'>
                <tr><td>

                    <div class='stats'><div class='stats-l'>Maximum HP</div><div class='stats-r' id='elite${i}maxHp'></div></div>
                    <div class='stats'><div class='stats-l'>Redeploy Time</div><div class='stats-r' id='elite${i}respawnTime'></div></div>
                    
                    <div class='stats'><div class='stats-l'>Attack Power</div><div class='stats-r' id='elite${i}atk'></div></div>
                    <div class='stats'><div class='stats-l'>Cost</div><div class='stats-r' id='elite${i}cost'></div></div>
                    
                    <div class='stats'><div class='stats-l'>Defense</div><div class='stats-r' id='elite${i}def'></div></div>
                    <div class='stats'><div class='stats-l'>Block</div><div class='stats-r' id='elite${i}blockCnt'></div></div>

                    <div class='stats'><div class='stats-l'>Magic Resistance</div><div class='stats-r' id='elite${i}magicResistance'></div></div>
                    <div class='stats'><div class='stats-l'>Attack Time</div><div class='stats-r' id='elite${i}baseAttackTime'></div></div>
                </tr><td>
                </table>
                ${rangeMaker(opdataFull.phases[i].rangeId)}
                <div style="margin:12px">
                ${materialHtml}
                </div>
                </div>
        `);
        
        statsCollapsible.append(statsLevelAll);
        statsCollapsible.append(statsTable);

        if(i > 0){

            var mats = $("<div class='small-container ak-shadow'>"
                        +   "<p>Elite "+i+"</p>"
                        +   "<span>Required materials</span>"
                        +   "<img class='topright' src='img/ui/elite/"+i+".png' width='100'>"
                        +   "<button class='btn btn-default btn-collapsible' data-toggle='collapse' data-target='#elite"+i+"MatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                        +   "<div id='elite"+i+"MatsCollapsible' class='collapse collapsible'>"
                        +    materialist.join("")
                        +   "</div></div>");
        } else {
            var mats = $("");
        }
        container.append(stats);
        container.append(statsCollapsible);
        // container.append(mats);
        return container;
    }
    function LinkCheck(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }
    // function AudioText(opdataFull,lang="en"){
    //     var curraudiolist = []
    //     var puretextlist =[]
    //     Object.keys(db.charword).forEach(element => {
    //         if(db.charword[element]){
    //             var curraudio = db.charword[element]
                
    //             if(curraudio.charId&&curraudio.charId == opdataFull.id){
    //                 curraudiolist.push(curraudio)
    //                 puretextlist.push(`${curraudio.charId},${opdataFull.appellation},${curraudio.voiceTitle},${db.storytextTL[curraudio.voiceTitle]?db.storytextTL[curraudio.voiceTitle]:""},"${curraudio.voiceText}"`)
    //             }
    //         }
    //     });
    //     // console.log(curraudiolist)
    //     console.log(puretextlist.join("\n"))
    // }translator
    function GetAudio (opdataFull,lang="en"){
        // console.log(opdataFull)
        
        var curraudiolist = []
        var puretextlist =[]
        var currTL = db.voicelineTL[opdataFull.id]
        Object.keys(db.charword).forEach(element => {
            if(db.charword[element]){
                var curraudio = db.charword[element]
                
                if(curraudio.charId&&curraudio.charId == opdataFull.id){
                    
                    curraudiolist.push(curraudio)
                    puretextlist.push(`${curraudio.charId},${opdataFull.appellation},${curraudio.voiceTitle},${db.storytextTL[curraudio.voiceTitle]?db.storytextTL[curraudio.voiceTitle]:""},"${curraudio.voiceText}"`)
                }
            }
        });
        // console.log(curraudiolist)
        // console.log(puretextlist.join("\n"))
        $('#opaudiocontent').html("")
        $('#opaudiotranslator').html("")
        $('#opaudioproofreader').html("")
        curraudiolist.forEach(element => {
            var curraudio  =`<audio controls preload="metadata" style="margin-top:5px"> <source src="./etc/voice/${element.voiceAsset}.mp3" type="audio/mpeg">Your browser does not support the audio tag.</audio> `
            // if(LinkCheck(`./etc/voice/${element.voiceAsset}.mp3`)){
            //     curraudio= '<audio controls> <source src="./etc/voice/${element.voiceAsset}.mp3" type="audio/mpeg">Your browser does not support the audio tag.</audio> '
            // }
            var voiceTL = element.voiceText
            if(currTL)voiceTL= currTL.voiceline[element.voiceTitle][lang]?currTL.voiceline[element.voiceTitle][lang]: element.voiceText
            // console.log(element.voiceTitle)
            // console.log(currTL)
            // console.log(currTL.voiceline[element.voiceTitle])
            // console.log(voiceTL)
            var currhtml = $(`
            <table class="story-table">
            <th>${db.storytextTL[element.voiceTitle]?db.storytextTL[element.voiceTitle]:element.voiceTitle}</th>
            <tr><td style="text-align:center;background:#1a1a1a">${curraudio}</td></tr>
            <tr><td style="height:10px"></td></tr>
            <tr><td>${voiceTL}</td></tr>
            <tr><td style="height:10px"></td></tr>
            </table>
            `)
            $('#opaudiocontent').append($(currhtml))
        });
        
        if(currTL){
            if(currTL.translator){
                $('#opaudiotranslator').html(`<div class="btn-infoleft">Voiceline Translation</div><div class="btn-inforight">${currTL.translator}</div>`)
            }else $('#opaudiotranslator').html()
            if(currTL.proofreader){
                $('#opaudioproofreader').html(`<div class="btn-infoleft">Voiceline Proofreader</div><div class="btn-inforight">${currTL.proofreader}</div>`)
            }else $('#opaudioproofreader').html()
        }
    }
    function GetStory (opdataFull){
        // console.log(opdataFull)
        let currStory = db.handbookInfo.handbookDict[opdataFull.id]
        // console.log(currStory)
        // console.log(currStory.drawName)
        // console.log(db.vaTL[currStory.infoName]?db.vaTL[currStory.infoName]:currStory.infoName)
        let illustrator = currStory.drawName
        let voiceActor = db.vaTL[currStory.infoName]?db.vaTL[currStory.infoName]:currStory.infoName
        $('#info-illustrator').html(`<div class="btn-infoleft">Illustrator</div><div class="btn-inforight"><a href="https://www.google.com/search?q=illustrator+${illustrator}"  target="_blank">${illustrator}</a></div>`)
        $('#info-voiceactor').html(`<div class="btn-infoleft">Voice Actor</div><div class="btn-inforight"><a href="https://www.google.com/search?q=Voice+Actor+${voiceActor}"  target="_blank">${voiceActor}</a></div>`)
        let puretext = []
        let textTL = []
        let islong =false
        puretext.push(opdataFull.appellation)
        puretext.push("")
        if(currStory.storyTextAudio){
            currStory.storyTextAudio.forEach(storySection => {
                puretext.push(`---------${storySection.storyTitle}-----------`)
                puretext.push(storySection.stories[0].storyText)
                puretext.push("")
                switch(storySection.storyTitle){
                    case "基础档案":
                        var basicInfo = storySection.stories[0].storyText.split("\n")
                        var basicInfoTL = []
                        var webTL = []
                        var titlebefore = ""
                        // if(basicInfo.length>20)islong = true;
                        // console.log(basicInfo.length)
                        basicInfo.forEach((info,n) => {
                            var check = /(【)(.*)(】)(.*)/
                            var infoTitle = check.exec(info)
                            if(infoTitle){
                                var title = db.storytextTL[infoTitle[2]]?db.storytextTL[infoTitle[2]]:infoTitle[2]
                                var content = infoTitle[4]
                                // console.log(infoTitle[2])
                                switch (infoTitle[2]) {
                                    case "代号": content = opdataFull.appellation;break;
                                    case "性别":
                                    console.log(content)
                                    content= db.storytextTL[content.trim()]
                                    $("#op-gender").html(titledMaker(content,`Gender`))
                                    ;break;
                                    case "表演经验":
                                    case "出厂时间":
                                    case "战斗经验": content= db.storytextTL[content.trim()]
                                    // console.log(infoTitle)
                                    // console.log("WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                                    // console.log(content)
                                    if (!content){
                                        var splitnum = infoTitle[4].trim().split("")
                                        var num = 0
                                        var count = 0
                                        var end = ""
                                        console.log(splitnum)
                                        splitnum.forEach(eachnum => {
                                            // console.log(eachnum)
                                            // console.log(typeof parseInt(eachnum))
                                            // console.log(parseInt(eachnum))
                                            if(typeof db.storytextTL[eachnum] == "number" ){
                                                console.log(db.storytextTL[eachnum])
                                                if(db.storytextTL[eachnum]==10 && count==1){
                                                    num = num*10
                                                }else{
                                                    num += db.storytextTL[eachnum]
                                                }
                                            }
                                            else if(typeof parseInt(eachnum)  == "number" && !isNaN(parseInt(eachnum))){
                                                num += parseInt(eachnum)
                                            }
                                            else{
                                                end = db.storytextTL[eachnum]
                                            }
                                            console.log(num)
                                            count++
                                        });
                                        
                                        if(num% 1 != 0){
                                            if(num<1){
                                                num = "Half a"
                                            }else{
                                                num = Math.floor(num) +" and a half"
                                            }
                                        }
                                        content = `${num} ${end}`
                                    }
                                    ;break;

                                    case "出厂日":
                                    case "生日":content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:BirthdayText(content);break;
                                    case "矿石病感染情况": 
                                    
                                    if(db.charastoryTL[opdataFull.id]&&db.charastoryTL[opdataFull.id]["originiumInfection"]&&content){
                                        
                                        content = db.charastoryTL[opdataFull.id]["originiumInfection"]
                                    }else if(content){
                                        var datasplit = content.split("，")
                                        // console.log(datasplit)
                                        var arraycontent = []
                                        datasplit.forEach(originiumdesc => {
                                            arraycontent.push(db.storytextTL[originiumdesc]?db.storytextTL[originiumdesc]:originiumdesc)
                                        });
                                        content = arraycontent.join(", ")
                                    }else {
                                        
                                        content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:content.replace("约","Approximately ");
                                    }
                                    
                                    ;break;
                                    default: 
                                    // console.log("WEEI" +titlebefore)
                                    
                                        content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:content.replace("约","Approximately ");
                                }
                                // console.log(title)
                                titlebefore = title
                                basicInfoTL.push(`[${title}] ${content}`)
                                if(content==""){
                                webTL.push(`<tr><td colspan="2" style="border-top: 1px solid #555;">${title}</td></tr>`)
                                }else
                                webTL.push(`<tr><td>${title}</td><td>${content}</td></tr>`)
                            }else{
                                // console.log(info.split("，"))
                                if(titlebefore =="Originium Infection"&& db.charastoryTL[opdataFull.id] && db.charastoryTL[opdataFull.id]["originiumInfection"]){
                                    content = db.charastoryTL[opdataFull.id]["originiumInfection"]
                                    titlebefore=""
                                    webTL.push(`<tr><td colspan=2>${content}</td> </tr>`)
                                }else {
                                    var datasplit = info.split("，")
                                    var content = []
                                    datasplit.forEach(originiumdesc => {
                                        content.push(db.storytextTL[originiumdesc]?db.storytextTL[originiumdesc]:originiumdesc)
                                    });
                                    
                                    webTL.push(`<tr><td colspan=2>${content.join(", ")}</td> </tr>`)
                                }
                                // else{
                                //     basicInfoTL.push(info)
                                //     webTL.push(`<tr><td colspan=2>${info}</td> </tr>`)
                                // }
                            }
                        });
                        textTL.push(`<div class="col-12 ${(islong?"":"col-sm-6")} top-buffer">
                        <table class="story-table"><th colspan=2>Basic File</th>${webTL.join("")}</table>
                        </div>`)
                        // textTL.push(basicInfoTL.join("</br>"))
                        // console.log(basicInfoTL.join("\n"))
                    ;break;
                case "综合性能检测结果" :
                case "综合体检测试" :
                    var basicInfo = storySection.stories[0].storyText.split("\n")
                    var basicInfoTL = []
                    var webTL = []
                    basicInfo.forEach(info => {
                        var check = /(【)(.*)(】)(.*)/
                        var infoTitle = check.exec(info)
                        if(infoTitle){
                            var title = db.storytextTL[infoTitle[2]]?db.storytextTL[infoTitle[2]]:infoTitle[2]
                            var content = infoTitle[4]
                            switch (infoTitle[2]) {
                                case "代号": content = opdataFull.appellation;break;
                                default: content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:content;
                            }
                            basicInfoTL.push(`[${title}] ${content}`)
                            webTL.push(`<tr><td>${title}</td> <td>${content}</td></tr>`)
                        }
                    })
                    // textTL.push(`<h2>Comprehensive test</h2>${basicInfoTL.join("</br>")}`)
                    textTL.push(`<div class="col-12 ${(islong?"":"col-sm-6")} top-buffer">
                    <table class="story-table">
                    <th colspan=2>${db.storytextTL[storySection.storyTitle]?db.storytextTL[storySection.storyTitle]:storySection.storyTitle}</th>
                    ${webTL.join("")}</table>
                    </div>`)
                    // console.log(basicInfoTL.join("\n"))
                    ;break;
                default:
                    var currstory 
                    // console.log(storySection.storyTitle)
                    // console.log(db.charastoryTL[opdataFull.id])
                    if(db.charastoryTL[opdataFull.id]&&db.charastoryTL[opdataFull.id][storySection.storyTitle]) 
                        currStory = db.charastoryTL[opdataFull.id][storySection.storyTitle].split("\n").join("</br>")
                    else 
                        currStory = (storySection.stories[0].storyText.replace(/■/g,"■ ")).split("\n").join("</br>")
                    // console.log(currstory)
                    textTL.push(`
                    <div class="col-12 top-buffer">
                    <table class="story-table">
                    <th colspan=2>${db.storytextTL[storySection.storyTitle]?db.storytextTL[storySection.storyTitle]:storySection.storyTitle}</th>
                    <tr><td>${currStory}</td></tr></table>
                    </div>`)
                    // textTL.push(`<h2>${storySection.storyTitle}</h2>`) 
                    // textTL.push(`</br>`) 
                    // textTL.push()
                    // console.log(`---------${storySection.storyTitle}-----------`)
                    // console.log(storySection.stories[0].storyText)
                    
                }
            });
        }
        if(db.charastoryTL[opdataFull.id]&&db.charastoryTL[opdataFull.id]["credit"]) $("#opstorycredits").html(`<div class="btn-infoleft">Trust Translation</div><div class="btn-inforight">${db.charastoryTL[opdataFull.id]["credit"]}</div>`)
        else $("#opstorycredits").html(``)
        $("#opstorycontent").html(`<div class="row">${textTL.join("")}</div>`)
        // console.log(textTL)
        console.log(puretext.join("\n"))
    }

    function BirthdayText(date) {
        console.log(date)
        var check = date.split("月")
        if(check[1]){
            var check2 = check[1].split("日")
            var check = `${check[0]}/${check2[0]}`
            var date = check.split("/")
            // console.log(date)
            if (date.length >=2)
            {
                // console.log(date[1])
                const currmonth = date[0]
                const currday = date[1]
                const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
                ];
                // console.log(`${monthNames[currmonth-1]} ${currday}`)
                // console.log(monthNames[currmonth-1])
                if (monthNames[currmonth-1] == undefined){
                    return date
                }
                return  monthNames[currmonth-1] + " " + currday
            }
        }else return date

    }

    function GetPotential(opdataFull){
        var potentials = opdataFull.potentialRanks
        var potentialsTL = []
        // console.log(potentials)
        var potRegex = /(.*?)([-]|[+])(\d*)(.*)|(.*)/
        potentials.forEach(element => {
            let regexDesc = potRegex.exec(element.description)
            // console.log(regexDesc)
            let currDesc = (regexDesc[1]?regexDesc[1]:regexDesc[5])
            let tlDesc = query(db.potentialTL,"skill_cn",currDesc).skill_en
            tlDesc = tlDesc?tlDesc:currDesc
            if(regexDesc[1]){
                tlDesc += " "+regexDesc[2] + regexDesc[3]
            }
            // console.log(tlDesc)
            potentialsTL.push(tlDesc)
        });
        return potentialsTL
    }

    function GetTalent(id,opdataFull){
        var combTalents = []
        // console.log(opdataFull.talents)
        for(i=0;i<opdataFull.talents.length;i++){
            var currTalent = opdataFull.talents[i]
            // if(!db.talentsTL[id])break;
            var currTalentTL = db.talentsTL[id]?db.talentsTL[id][i]:undefined
            var talentGroup = []
            for(j=0;j<currTalent.candidates.length;j++){
                var currCandidate = currTalent.candidates[j] 
                var currCandidateTL = currTalentTL?currTalentTL[j]:undefined
                talentGroup.push({talent:currCandidate,talentTL:currCandidateTL})
            }
            combTalents.push(talentGroup)
        }
        return TalentParse(combTalents)
    }

    function TalentParse(combTalents){
        // console.log(combTalents)
        var talent = []
        combTalents.forEach(combcandidate => {
            let talentlist = []
            combcandidate.forEach(eachtalent => {
                var imagereq = []
                if(eachtalent.talent.unlockCondition.level >0)
                imagereq.push(`Lv.${eachtalent.talent.unlockCondition.level}`)
                if(eachtalent.talent.unlockCondition.phase >0)
                imagereq.push(`<img src="./img/ui/elite/${eachtalent.talent.unlockCondition.phase}.png" style="width:20px;margin-top:-5px" title="Elite ${eachtalent.talent.unlockCondition.phase}">`)
                if(eachtalent.talent.requiredPotentialRank >0)
                imagereq.push(`<img src="./img/ui/potential/${eachtalent.talent.requiredPotentialRank+1}.png" style="width:20px" title="Potential ${eachtalent.talent.requiredPotentialRank+1}">`)


                var currTalentName = eachtalent.talentTL?eachtalent.talentTL.name:eachtalent.talent.name
                var currTalentDesc = eachtalent.talentTL?eachtalent.talentTL.desc:eachtalent.talent.description
                var info = `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">${imagereq.join("")}</div>`
                talentlist.push(`
                <div style="background:#444;margin:4px;padding:2px;padding-top:2px;background:#444;border-radius:2px;">
                <div style="vertical-align:top;${eachtalent.talent.rangeId?`width:71%;display:inline-block;padding-right:0px;margin-right:-6px;height:100%`:""}">
                    <div style="color:#222;font-size:13px;background:#999;display:inline-block;padding:2px;border-radius:2px">${currTalentName} ${info}</div>
                    <div style="font-size:11px;">${currTalentDesc}</div>
                </div>
                    ${eachtalent.talent.rangeId?`<div style="display:inline-block;width:28%;padding:0px;margin:auto;padding-top:4px">${rangeMaker(eachtalent.talent.rangeId,false)}</div>`:""}
                </div>
                `)
            });
            talent.push(`
                <div class="ak-shadow" style="margin-bottom:8px;padding-top:10px;padding:2px;background:#666">
                    ${talentlist.join("")}
                </div>`)
        });
        return `
        
            <div style="padding-top:10px">
            <div style="color:#fff;text-align:center;background:#333;padding-bottom:0px">Talent</div> 
                ${talent.join("")}
            </div>`
    }
    // ${titledMaker(,eachtalent.talentTL.name,"","","font-size:10px;background:#444;color:#ddd")}
    function GetSkillCost(i2,i, opdataFull){
        let reqmats=[]
        if(i2!=0&&i2<7){
            // console.log(opdataFull.allSkillLvlup[i2])
            reqmats = opdataFull.allSkillLvlup[i2-1].lvlUpCost
        
        }else if(i2>=7){
            // console.log(opdataFull.skills[i])
            reqmats = opdataFull.skills[i].levelUpCostCond[i2-7].levelUpCost
        }
        return reqmats
    }
    function GetEliteCost(i,opdataFull){
        if(i>0){
            // console.log(opdataFull)
            let reqmats = [];
            // console.log(db.dataconst["evolveGoldCost"][opdataFull.rarity])
            // console.log(i)
            if(reqmats){
                if(opdataFull.phases[i]){
                    // console.log(curChara.rarity+1)
                    // console.log(db.dataconst["evolveGoldCost"][curChara.rarity][num-1])
                    reqmats=([{"count":(db.dataconst["evolveGoldCost"][opdataFull.rarity][i-1]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                , "id" :4001
                                ,"type":"GOLD" }])
                }
            }
            reqmats = opdataFull.phases[i] ? reqmats.concat(opdataFull.phases[i].evolveCost) : undefined;
            // console.log(reqmats)
            return reqmats
        }else{
            return undefined
        }
    }
    function CreateMaterial(id,count){
        var itemdata = db.items[id];
        var itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
        var material = 
        (`<div class="akmat-container" style="position:relative">
            <div class="item-name" title="${itemdata.name}">${(itemdataTL.name_en?itemdataTL.name_en:itemdata.name)}</div>
            <div class="item-image">
                <img id="item-image" src="img/items/${itemdata.iconId}.png">
            </div>
            <img class="item-rarity" src="img/material/bg/item-${itemdata.rarity+1}.png">
            <div class="item-amount">${count}x</div>
        </div>`)
        return material
    }
    function getSpeciality(description,opdataFull){

        //gonna need to split on "," and "\n" and repeat it
        let descriptions = description.split(/[，(\\n)]/)
        let splitdesc = []
        // console.log("=====================")
        console.log(descriptions)
        descriptions.forEach(element => {
            if(element){
                let muhRegex = /<@ba\.kw>(.*?)<\/>/g
                let currSpeciality = muhRegex.exec(element)
                // console.log(currSpeciality)
                let filterDesc
                if(currSpeciality){
                    splitdesc.push([element.replace(currSpeciality[0],""),currSpeciality[1]])
                }else{
                    splitdesc.push([element])
                }
            }
        });
        // console.log(splitdesc)
        // console.log("===========================")
        
        return SpecialityHtml(splitdesc,opdataFull)
    }
    function GetTrust(opdataFull){
        // console.log()
        let mintrust = opdataFull.favorKeyFrames[0].data
        let maxtrust = opdataFull.favorKeyFrames[1].data
        let differences = {}
        // console.log(mintrust)
        Object.keys(mintrust).forEach(key => {
            // console.log(key)
            if(mintrust[key]!=maxtrust[key])
            differences[key]=maxtrust[key]-mintrust[key]
        });
        // console.log(differences)

        return TrustParse(differences)
    }
    function TrustParse(differences) {
        let readable = []
        Object.keys(differences).forEach(key => {
            let currInfo
            switch (key){
                case "maxHp": currInfo="Maximum HP" ;break;
                case "atk": currInfo="Attack" ;break;
                case "def": currInfo="Defense" ;break;
                case "magicResistance": currInfo="Magic Resist" ;break;
                case "cost": currInfo="Cost" ;break;
                case "blockCnt": currInfo="Block Count" ;break;
                case "moveSpeed": currInfo="Move Speed" ;break;
                case "attackSpeed": currInfo="Attack Speed" ;break;
                case "baseAttackTime": currInfo="Attack time" ;break;
                case "respawnTime": currInfo="Redeploy time" ;break;
                case "hpRecoveryPerSec": currInfo="HP recovery" ;break;
                case "spRecoveryPerSec": currInfo="SP recovery" ;break;
                default: currInfo = key ; break;
            }

            readable.push(`${currInfo} +${differences[key]}`)
        });
        return titledMaker(readable.join("</br>"),"Trust extra status","","","color:#ddd;min-width:120px")
    }
    function SpecialityHtml(splitdesc,opdataFull){
        let splitdescTL = []
        let color = ""
        let trait = opdataFull.trait
        console.log(trait)
        let isReplaced = false
        splitdesc.forEach(element => {
            if(element.length>1){
                let typetl = db.attacktype.find(search=>search.type_cn==element.join(""))
                // if(!typetl) typetl = db.attacktype.find(search=>search.type_cn==element[1])
                if(typetl&&!color) color = typetl.type_color?typetl.type_color:undefined

                // console.log(element)
                let muhRegex = /(.*){(.*?)}(.*)/g
                let currTLconv = muhRegex.exec(typetl?typetl.type_en:element.join(""))
                if(currTLconv){
                    console.log(currTLconv)
                    var textreplace = 'Value'
                    if(trait && trait.candidates.length>1){
                        textreplace =  `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">(value)</div>`
                    }else if (trait && trait.candidates.length==1) {
                        textreplace = trait.candidates[0].blackboard[0].value
                        if(currTLconv[2].includes("%")){
                            textreplace= textreplace*100 +("%")
                        }
                        isReplaced = true
                    }
                }
                let currTLconvfinal = currTLconv?currTLconv[1] + textreplace + currTLconv[3]:typetl?typetl.type_en:element.join("")
                splitdescTL.push(currTLconvfinal)
            }else{
                var typetl = db.attacktype.find(search=>{
                    if(search.type_detail=="common")
                    return search.type_cn==element[0]
                })
                if(!typetl){
                    typetl = db.attacktype.find(search=>search.type_cn==element.join(""))
                }
                // console.log(element.join(""))

                // console.log(typetl)
                
                if(typetl&&!color) color = typetl.type_color?typetl.type_color:undefined
                splitdescTL.push(typetl?typetl.type_en:element[0])
            }
        });
        if(trait&&!(isReplaced)){
            trait.candidates.forEach(element => {
                var imagereq = []
                    if(element.unlockCondition.level >0)
                    imagereq.push(`Lv.${element.unlockCondition.level}`)
                    if(element.unlockCondition.phase >0)
                    imagereq.push(`<img src="./img/ui/elite/${element.unlockCondition.phase}.png" style="width:20px;margin-top:-5px" title="Elite ${element.unlockCondition.phase}">`)
    
                // console.log(s)
                var each = []
                element.blackboard.forEach(eachbb => {
                    each.push(`${eachbb.key} : ${eachbb.value}`)
                });
                var info = `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px;margin-right:3px">${ each.join(" ")}</div>
                <div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">${imagereq.join("")}</div>`
                splitdescTL.push(info)
            });
        }
        // console.log(splitdescTL)
        // console.log(color)

        return titledMaker(splitdescTL.join("</br>"),"Traits",`ak-trait-${color}`)
        // splitdescTL
    }

    function titledMaker (content,title,extraClass="",extraId="",extraStyle=""){
        let titledbutton = `
        <div style="padding-top:5px;display:inline-block">
        <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char  ${extraClass}\" style="text-align:left;min-width:80px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
        ${(title==""?"":`<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>`)}${content}</div>
        </div>`

        return titledbutton
    }
    function rangeMaker(rangeId,withText=true,extend=0){
        var rangeData ={}
        var rangeDataOrigin = Object.assign({},db.range[rangeId])

        // extend =0
        if(rangeDataOrigin){
            let minRow = 0
            let minCol = 0
            let maxRow = 0
            let maxCol = 0
            let table = []
            let grids = []
            // console.log(rangeDataOrigin.grids)
            if(rangeDataOrigin){
                if(extend>0){
                    
                }
                rangeData = Object.assign({},rangeDataOrigin)
                rangeData.grids = []
                rangeDataOrigin.grids.forEach(element => {
                    maxRow = Math.max(maxRow,element.row)
                    maxCol = Math.max(maxCol,element.col)
                    minRow = Math.min(minRow,element.row)
                    minCol = Math.min(minCol,element.col)

                    // console.log(element)
                    // if(extend>0&&element.col>0){
                        
                    //  }
                     if(element.col>0&&extend>0){
                        rangeData.grids.push({row:element.row,col:element.col+parseFloat(extend)})
                     }else{
                        rangeData.grids.push({row:element.row,col:element.col})
                     }
                    
                });
                if(extend>0){
                    maxCol +=extend
                }
                if(extend>0){
                   for(i=minRow;i<=maxRow;i++){
                        for(j=1;j<=extend;j++){
                            // console.log(`${i} : ${j}`)
                            rangeData.grids.push({row:i,col:j,special:true})
                            
                        }
                   }
                }
                extend = 0
            }
            // console.log(rangeData.grids)
            table.push(`<div class="rangeTableContainer"><table class='rangeTable' style="table-layout: fixed;border-spacing:0 15px;padding:4px; border-collapse:separate; border-spacing:2px;width:${(maxCol+minCol+1)*17}px;">`)
            
            for(r=0;r+minRow<maxRow+1;r++){
                table.push(`<tr style="height:17px">`)
                // if(extend>0&&r>1){
                //     extend--
                //     r=1
                // }
                // console.log(r+minRow)
                for(c=0;c+minCol<maxCol+1;c++){
                    table.push(`<td style=";width:17px`)
                    if(r+minRow==0&&c+minCol==0){
                        table.push(";background:#DDD")
                    }else{
                        rangeData.grids.forEach(element => {
                            if(element.row==r+minRow&&element.col==c+minCol){
                                if(element.special){
                                    table.push(";border: 2px solid #00FF6688;")
                                }else{
                                    table.push(";border: 2px solid #DDDDDD88;")
                                }
                            }
                        });
                    }
                    
                    table.push(`"></td>`)
                }
            }
            table.push(`</table>`);
            table.push(`${withText?`<div><span style="all:inherit;">Range</span></div>`:""}</div>`);
            return table.join("")
        }else{
            return undefined
        }
    }

    function changeEliteLevel(el,elite_no,max){
        var value = $(el).val();
        $("#elite"+elite_no+"LevelDisplay").val(value);
        $("#elite"+elite_no+"LevelSlider").val(value);
        EliteStatsDisplay(Math.min(value,max),elite_no);
    }

    function EliteStatsDisplay(level,elite_no){
        $("#elite"+elite_no+"maxHp").html(statsInterpolation('maxHp',level,elite_no));
        $("#elite"+elite_no+"def").html(statsInterpolation('def',level,elite_no));
        $("#elite"+elite_no+"atk").html(statsInterpolation('atk',level,elite_no));
        $("#elite"+elite_no+"magicResistance").html(statsInterpolation('magicResistance',level,elite_no));
        $("#elite"+elite_no+"respawnTime").html(statsInterpolation('respawnTime',level,elite_no)+`<div style='display:inline;font-size:10px'> Sec</div>`);
        $("#elite"+elite_no+"cost").html(statsInterpolation('cost',level,elite_no));
        $("#elite"+elite_no+"blockCnt").html(statsInterpolation('blockCnt',level,elite_no));
        $("#elite"+elite_no+"baseAttackTime").html(statsInterpolation('baseAttackTime',level,elite_no,false)+`<div style='display:inline;font-size:10px'> Sec</div>`);
    }

    function statsInterpolation(key,level,elite_no,isround=true){
        var kf = [];
        $.each(opdataFull.phases[elite_no].attributesKeyFrames,function(j,v){
            kf[j] = v;
        });
        // console.log([kf[0].level,kf[1].level])
        // console.log([kf[0].data[key],kf[1].data[key]])
        if(kf[0].data[key] == kf[1].data[key]){
        return kf[0].data[key]
        }else {
            var pol = everpolate.linear([level],[kf[0].level,kf[1].level],[kf[0].data[key],kf[1].data[key]]);
            if(isround)
            return Math.round(pol);
                else
            return parseFloat(Math.round(pol*100))/100;
        }
        
    }

    function changeSkillLevel(el,skill_no){
        var value = $(el).val();
        $("#skill"+skill_no+"StatsCollapsible").children("table").removeClass("active");
        $("#skill"+skill_no+"level"+(value-1)+"stats").addClass("active");
        $("#skill"+skill_no+"LevelDisplay").html(SkillRankDisplay(value));
    }

    function SkillRankDisplay(skill_no){
        let img = "./img/ui/rank/"
        let html =""
        if(skill_no>0&&skill_no<7){
            img += skill_no+".png"
            html = `<img src="${img}" style="width:40px">`
        }else if(skill_no>=7){
            let imgM = img +"m-"+ (skill_no-7)+".png"
            img += "7.png"
             
            html = `<img src="${img}" style="width:40px"><div class="akrankmastery"><img src="${imgM}" style="width:40px"></div>`
        }
        return html
    }
      
    function getSkillDesc(skillId,level){
        var skill = db.skills[skillId].levels[level];
        var skillTL = db.skillsTL[skillId];
        var desc = skillTL?skillTL.desc[level]:skill.description;
        //console.log(`Skill|${skillId}|${skill.name} `);
        //console.log(skill.blackboard)
        // console.log(desc)
        
        // console.log(skillTL);
        if(!skillTL){
            let muhRegex = /<@ba\.vup>(.*?)<\/>/
            let desc2 = muhRegex.exec(desc)[1]
            // desc2 = desc2.replace(/({)(.*?)(\:.*?)(})/,"")
            let muhRegex2 = /({)(.*?)(\:.*?)(})/
            let desc3 = muhRegex2.exec(desc2)
            
            if(desc3){
                desc3[2] = `{${desc3[2]}}`
                desc3[3] = desc3[3].replace(":",":.")
                let desc4 = []
                // console.log(desc3)
                for(i=1;i<desc3.length;i++){
                    desc4.push(desc3[i])
                }
                // console.log(desc4)
                desc = desc.replace(/<@ba\.vup>(.*?)<\/>/,desc4.join(""))
            }
        }

        // if(skillTL){

            var matches = desc.match(/(\{\{(.*?)\}:.0(.)\}|\{(.*?)\})/gm);
            // console.log(matches)
            $.each(matches,function(i,v){
                var submatches = v.match(/(?:(?!\{).(?!:))+/gm);
                
                if(!submatches[1]){
                    submatches = v.match(/(?:(?!\{).(?!$))+/gm);
                }
                // console.log(submatches)
                var value;
                for (var i = 0; i < skill.blackboard.length; i++) {
                    // console.log(skill.blackboard)
                    if(skill.blackboard[i].key == submatches[0]){
                        value = skill.blackboard[i].value;
                        // console.log(value)
                    }
                }
                if(value){
                    if(typeof submatches[1] != "undefined"){
                        // console.log(submatches[1])
                        if(submatches[1].includes("%")){
                            value = Math.round((value * 100)) + "%";
                        }
                    }
                    desc = desc.replace(v,`<div class="stat-important">${value}</div>`);
                }
            });
        // }else{

        // }
        // console.log(desc);
        return desc;
    }

    function query(db,key,val,single=true,returnKey=false){
        if(single){
            var result = {};
        } else {
            var result = [];
        }
        var found = false;
        $.each(db,function(key2,v){
            if(eval('v.'+key).toLowerCase() == val.toLowerCase()){
                found = true;
                if(single){
                    if(returnKey){
                        result[key2] = v;
                    } else {
                        result = v;
                    }
                    return false;
                } else {
                    if(returnKey){
                        var obj = {};
                        obj[key2] = v; 
                        result.push(obj);
                    } else {
                        result.push(v);
                    }
                }
            }
        });
        if(found){
            return result;
        } else {
            return false;
        }
    }

    function changeUILanguage(){
        reg = localStorage.gameRegion;
        lang = localStorage.webLang;

        $('#display-reg').text(reg.toUpperCase())
        
        switch (lang) {
            case "en":$('#display-lang').text("English");break;
            case "cn":$('#display-lang').text("Chinese");break;
            case "jp":$('#display-lang').text("Japanese");break;
        }
        
        localStorage.setItem("gameRegion", reg);
        localStorage.setItem("webLang", lang);
        getJSONdata("ui",function(data){
            if(data.length != 0){
                $.each(data, function(i,text){
                    $("[translate-id="+text.id).html(text['ui_'+lang]);
                });
            }
        });
    }

    function getJSONdata(type, callback){
        var x = 0;
        var req = $.getJSON("json/tl-"+type+".json");
        req.done(function(response){
            callback(response);
        });
        req.fail(function(response){
            console.log("type: "+type+" fail: ");
            console.log(response);
        });
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }