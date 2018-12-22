angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [{
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('Terms', function($scope, $stateParams) {})

.controller('Impresum', function($scope, $stateParams) {})

.controller('ChooseCity', function($scope, $stateParams, $http, $location,
  $filter,$rootScope) {

  $scope.date = new Date();
  $scope.appDate = $filter('date')($scope.date, "dd.MM.yyyy.");

  $http.get("http://www.plivazdravlje.hr/alergije/prognoza?xml2")
    .success(function(response) {

      $scope.details = response;

      var x2js = new X2JS();
      var xmlText = x2js.parseXmlString(response);

      $scope.jsonObj = x2js.xml2json(xmlText);
      console.log($scope.jsonObj.cities);
      //console.log($scope.jsonObj);

      $scope.listOfCities = [];

      angular.forEach($scope.jsonObj.cities.city, function(item,
        redniBroj) {
        $scope.listOfCities.push({
          "cityName": item.name,
          "cityLink": item.link,
          "cityID": item._id
        });
      });

    });

/////////////////////////////////////////////
/////////////////POCETAK PROVJERE SEJVANOG GRADA OD PRIJE
/////////////////////////////////////////////

  $scope.localStorageCity = localStorage.getItem("cityName");
  $scope.localStorageCityId = localStorage.getItem("cityId");
  console.log("cityName");
  console.log($scope.localStorageCity);
  console.log("cityId");
  console.log($scope.localStorageCityId);


  // AKO IMA GRAD SEJVAN
   if($scope.localStorageCity != "" && $scope.localStorageCity != "undefined" && $scope.localStorageCity != null) {


   if($scope.localStorageCityId != "" && $scope.localStorageCityId != "undefined" && $scope.localStorageCityId != null) {

         $location.path("/chosenCity/" + $scope.localStorageCity + "/" + $scope.localStorageCityId);



         $scope.go = function(page) {

           localStorage.setItem("cityName", page.cityName); //It's saved!
           localStorage.setItem("cityId", page.cityID); //It's saved!

            var citySelected = localStorage.getItem("cityName"); //Let's grab it and save it to a variable
            var cityId = localStorage.getItem("cityId"); //Let's grab it and save it to a variable
           console.log("cityID="); //Logs "Hello World!"
           console.log(cityId); //Logs "Hello World!"
        //  console.log("page");
        //  console.log(page);

            console.log("cityName");
            console.log(citySelected);
            console.log("cityId");
            console.log(cityId);

           $location.path("/chosenCity/" + page.cityName + "/" + page.cityID);
           console.log('/chosenCity/' + page.cityName + "/" + page.cityID);

         };

   }

   }

// AKO NEMA GRAD SEJVAN
  else {

     $scope.go = function(page) {

       localStorage.setItem("cityName", page.cityName); //It's saved!
       localStorage.setItem("cityId", page.cityID); //It's saved!
       var citySelected = localStorage.getItem("cityName"); //Let's grab it and save it to a variable
       var cityId = localStorage.getItem("cityId");
       console.log(citySelected); //Logs "Hello World!"

       $location.path("/chosenCity/" + citySelected + "/" + cityId);
       console.log('/chosenCity/' + citySelected + "/" + cityId);

     };

   }


   /////////////////////////////////////////////
   /////////////////KRAJ PROVJERE SEJVANOG GRADA OD PRIJE
   /////////////////////////////////////////////

})

.controller('ChosenCity', function($scope, $stateParams, $filter, $http) {

  $scope.citySelected = $stateParams.cityid;
  $scope.citySelectedID = $stateParams.cityIdNumber;

////////////////////////////////////////////////
////////////////VREMENSKA API START ///////////
//////////////////////////////////////////////

//http://api.openweathermap.org/data/2.5/weather?q=karlovac&mode=json&units=metric&appid=24444200959c97eead79b2c03f891fa7

$scope.weatherapi = "http://api.openweathermap.org/data/2.5/weather?q=" + $scope.citySelected + "&mode=json&lang=hr&units=metric&appid=24444200959c97eead79b2c03f891fa7";

$http.get($scope.weatherapi).success(function(response) {

  $scope.weatherData = response;
  console.log($scope.weatherData);
  console.log($scope.weatherapi);

});




///////////////////////////////////////////////
////////////////PLIVA API START ////////////////
////////////////////////////////////////


  $scope.date = new Date();
  $scope.appDate = $filter('date')($scope.date, "dd.MM.yyyy.");


  $scope.queryString = "http://www.plivazdravlje.hr/alergije/prognoza/" + $scope.citySelectedID + "/" +
  $scope.citySelected + ".html?xml2";

  //console.log($scope.queryString);
  ///// start
  //http: //www.plivazdravlje.hr/alergije/prognoza/10/Zagreb.html?xml2
  $http.get($scope.queryString).success(function(response) {

    $scope.details = response;

    var x2js = new X2JS();
    var xmlText = x2js.parseXmlString(response);

    $scope.jsonObj = x2js.xml2json(xmlText);
    //  console.log($scope.jsonObj.measure);
    console.log($scope.jsonObj);

    $scope.firstVisible = false;
    $scope.secondVisible = false;

    $scope.listOfCitiParams = [];
    $scope.listOfCitiParamsBig = [];

      if($scope.jsonObj.measure){

        $scope.firstVisible = true;

        $scope.secondVisible = false;
        //  console.log("ima ga");
        ////////////////////
        /////// TU SAM STAOO
        ///////////////////
        angular.forEach($scope.jsonObj.measure.plant, function(item, redniBroj) {

          if(item.name == "Čempresi") {

            $scope.listOfCitiParams.push({
              "plantName": item.name,
              "plantData": item.daily,
              "plantPhoto": "img/cempresi@3x.png"
            });

          }

          else {
            $scope.listOfCitiParams.push({
              "plantName": item.name,
              "plantData": item.daily,
              "plantPhoto": "img/" + $filter('lowercase')(item.name) + "@3x.png"
            });

          }






            //console.log($scope.listOfCitiParams[0].plantData.day[0].level.__text);
          });

          console.log($scope.listOfCitiParams);

      } else {
        console.log("nema ga");

        $scope.firstVisible = false;
        $scope.secondVisible = true;

        angular.forEach($scope.jsonObj.forecast, function(item, redniBroj) {

        //  console.log(redniBroj);
          if(redniBroj != "_city"){
            if(redniBroj != "_time"){

              if(redniBroj == "tree"){
                  $scope.listOfCitiParamsBig.push({
                    "plantName": "Drveće",
                    "plantNameEn": redniBroj,
                    "plantData": item.daily,
                    "plantPhoto": "img/" + $filter('lowercase')(redniBroj) + "@3x.png"
                  });
               } else if(redniBroj == "grass"){
                   $scope.listOfCitiParamsBig.push({
                     "plantName": "Trave",
                     "plantNameEn": redniBroj,
                     "plantData": item.daily,
                       "plantPhoto": "img/" + $filter('lowercase')(redniBroj) + "@3x.png"
                   });
                } else if(redniBroj == "weed"){
                    $scope.listOfCitiParamsBig.push({
                      "plantName": "Korovi",
                      "plantNameEn": redniBroj,
                      "plantData": item.daily,
                        "plantPhoto": "img/" + $filter('lowercase')(redniBroj) + "@3x.png"
                    });
                 }

            }
          }

            //console.log($scope.listOfCitiParams[0].plantData.day[0].level.__text);
          });

        //  console.log($scope.listOfCitiParamsBig[0].plantData.day[2].value["__text"]);


      }


  /// END
  }).finally(function(response) {

    var myEl = angular.element( document.querySelector( '#idGetter' ) );
    myEl.removeClass('loader');

  })

  $scope.textForCityDown = "";

  if($stateParams.cityid == "Beli Manastir"){

      $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Osječko-baranjske županije";

  } else if($stateParams.cityid == "Dubrovnik") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Dubrovačko-neretvanske županije";

  } else if($stateParams.cityid == "Karlovac") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Karlovačke županije";

  } else if($stateParams.cityid == "Kutina") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Sisačko-moslavačke županije";

  } else if($stateParams.cityid == "Metković") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Dubrovačko-neretvanske županije";

  } else if($stateParams.cityid == "Našice") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Osječko-baranjske županije";

  } else if($stateParams.cityid == "Osijek") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Osječko-baranjske županije";

  } else if($stateParams.cityid == "Pula") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Istarske županije";

  } else if($stateParams.cityid == "Rijeka") {

        $scope.textForCityDown ="Izvor podataka: Nastavni zavod za javno zdravstvo Primorsko-goranske županije";

  } else if($stateParams.cityid == "Šibenik") {

        $scope.textForCityDown ="";

  }else if($stateParams.cityid == "Sisak") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Sisačko-moslavačke županije";

  }else if($stateParams.cityid == "Slavnoski Brod") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Brodsko-posavske županije";

  }else if($stateParams.cityid == "Split") {

        $scope.textForCityDown ="Izvor podataka: Nastavni zavod za javno zdravstvo Splitsko-dalmatinske županije";

  }else if($stateParams.cityid == "Varaždin") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Varaždinske županije";

  }else if($stateParams.cityid == "Virovitica") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo 'Sveti Rok' Virovitičko-podravske županije";

  }else if($stateParams.cityid == "Zadar") {

        $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Zadarske županije";

  }else if($stateParams.cityid == "Zagreb") {

        $scope.textForCityDown ="Izvor podataka: Nastavni zavod za javno zdravstvo 'Dr. Andrija Štampar'";

  }

  console.log($scope.citySelected);

})

.controller('PlantDetailed', function($scope, $stateParams, $http, $ionicSlideBoxDelegate) {
    $scope.plantSelected = $stateParams.plantId;

    $http.get('js/content.json').success(function(data) {


        $scope.details = data;
        $scope.secondVisible = false;
        $scope.thirdVisible = false;

        console.log(data);

        $scope.listPlantDetailedOne = [];
        $scope.finalList2 = [];

        angular.forEach($scope.details.contentItem, function(item,redniBroj) {
  //console.log( item.herbTitle);
          //console.log(item.herbCategory);
            if ($scope.plantSelected == item.herbTitle) {
              console.log("ajdeee");
              $scope.listPlantDetailedOne.push({
                "plantName": item.herbTitle,
                "plantText": item.mainText,
                "plantImg1": item.img1,
                "plantImg2": item.img2,
                "plantImg3": item.img3,
                "latin": item.latinName,
                "plantAlergentnost":item.stupanjAlergentnosti
              });


            }
        });
        console.log("ovo-gledam");
        console.log($scope.listPlantDetailedOne);





        if($scope.listPlantDetailedOne[0].plantImg1 != ""){
          $scope.finalList2.push({
              "plantImage":  $scope.listPlantDetailedOne[0].plantImg1
          });
          //console.log($scope.listPlantDetailedOne[0].plantImg1);
        }

        if($scope.listPlantDetailedOne[0].plantImg2 != ""){
          $scope.finalList2.push({
              "plantImage":  $scope.listPlantDetailedOne[0].plantImg2
          });
          console.log($scope.listPlantDetailedOne[0].plantImg2);
        }

        if($scope.listPlantDetailedOne[0].plantImg3 != ""){

          $scope.finalList2.push({
              "plantImage":  $scope.listPlantDetailedOne[0].plantImg3
          });
          console.log($scope.listPlantDetailedOne[0].plantImg3);

        }

        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();

      });

  })


.controller('Newsletter', function($scope, $stateParams, $http, $location,
  $filter) {

    $scope.returnMsg = "";

  $scope.date = new Date();
  $scope.appDate = $filter('date')($scope.date, "MM.dd.yyyy.");

  $http.get("http://www.plivazdravlje.hr/alergije/prognoza?xml2")
    .success(function(response) {

      $scope.details = response;

      var x2js = new X2JS();
      var xmlText = x2js.parseXmlString(response);

      $scope.jsonObj = x2js.xml2json(xmlText);
    //  console.log($scope.jsonObj.cities);
      //console.log($scope.jsonObj);

      $scope.listOfCities = [];

      angular.forEach($scope.jsonObj.cities.city, function(item,
        redniBroj) {
        $scope.listOfCities.push({
          "cityName": item.name,
          "cityLink": item.link,
          "cityID": item._id
        });
      });

      //    console.log($scope.listOfCities);

    });


///// SLANJE NA SERVER newsletter prijave

  $scope.user = {};


    $scope.submitNl = function() {

/*
    console.log("--ovo--");
    console.log($scope.user.selectedCity.cityName);
    console.log("--ovo--");*/
    //console.log($scope.exampleForm.email);


      // dohvati odabrani grad za izracun sifre
      $scope.selCity = $scope.user.selectedCity.cityName;
      $scope.derivatedCity = "";

    //  console.log("ovooo");

    //  console.log($scope.formData.cityVal.cityName);



// izracun sifre
    if($scope.selCity != null ){

    if($scope.selCity == "Beli Manastir"){
        $scope.derivatedCity = "10";
    } else if($scope.selCity == "Dubrovnik"){
        $scope.derivatedCity = "17";
    }else if($scope.selCity == "Karlovac"){
        $scope.derivatedCity = "4";
    }else if($scope.selCity == "Kutina"){
        $scope.derivatedCity = "6";
    }else if($scope.selCity == "Metković"){
        $scope.derivatedCity = "18";
    }else if($scope.selCity == "Našice"){
        $scope.derivatedCity = "8";
    }else if($scope.selCity == "Osijek"){
        $scope.derivatedCity = "7";
    }else if($scope.selCity == "Pula"){
        $scope.derivatedCity = "20";
    }else if($scope.selCity == "Rijeka"){
        $scope.derivatedCity = "14";
    }else if($scope.selCity == "Šibenik"){
        $scope.derivatedCity = "21";
    }else if($scope.selCity == "Sisak"){
        $scope.derivatedCity = "5";
    }else if($scope.selCity == "Slavonski Brod"){
        $scope.derivatedCity = "13";
    }else if($scope.selCity == "Split"){
        $scope.derivatedCity = "16";
    }else if($scope.selCity == "Varaždin"){
        $scope.derivatedCity = "3";
    }else if($scope.selCity == "Virovitica"){
        $scope.derivatedCity = "11";
    }else if($scope.selCity == "Zadar"){
        $scope.derivatedCity = "15";
    }else if($scope.selCity == "Zagreb"){
        $scope.derivatedCity = "1";
    }

    }



      $http.get("http://www.plivazdravlje.hr/alergije/prognoza/" +  $scope.derivatedCity + "/?plivahealth[apemail]=" +  $scope.user.email)

        .success(function(response) {
          //console.log("U sljedećih nekoliko minuta u vašem sandučiću ćete primiti poruku sa uputom za nastavak prijave.");
          $scope.returnMsg = "U sljedećih nekoliko minuta u vašem sandučiću ćete primiti poruku sa uputom za nastavak prijave.";
        })

        .error(function(response){
          $scope.returnMsg = "Već ste registrirani.";
        });




    };


})


.controller('citySelectedDetail', function($scope, $stateParams, $filter, $http) {

    $scope.citySelected = $stateParams.cityParam;
    $scope.citySelectedID = $stateParams.cityIdParam;
    $scope.citySelectedPlant = $stateParams.cityPlant;
    $scope.selectedPlantType = $stateParams.cityPlant;

    if($stateParams.cityPlant == "weed"){
        $scope.citySelectedPlant = "korovi";
        $scope.citySelectedPlantEng = "weed";
    }

    else if( $stateParams.cityPlant== "tree"){
        $scope.citySelectedPlant = "drveće";
        $scope.citySelectedPlantEng = "tree";
    }

    else if( $stateParams.cityPlant == "grass" ){
        $scope.citySelectedPlant = "trave";
        $scope.citySelectedPlantEng = "grass";
    }

    else if( $stateParams.cityPlant == "Borovi" ){
        $scope.citySelectedPlant = "borovi";
        $scope.citySelectedPlantEng = "borovi";
    }

    else if( $stateParams.cityPlant == "Breza" ){
        $scope.citySelectedPlant = "breza";
        $scope.citySelectedPlantEng = "breza";
    }

    else if( $stateParams.cityPlant == "Brijest" ){
        $scope.citySelectedPlant = "brijest";
        $scope.citySelectedPlantEng = "brijest";
    }

    else if( $stateParams.cityPlant == "Čempresi" ){
        $scope.citySelectedPlant = "čempresi";
        $scope.citySelectedPlantEng = "cempres";
    }

    else if( $stateParams.cityPlant == "Grab" ){
        $scope.citySelectedPlant = "grab";
        $scope.citySelectedPlantEng = "grab";
    }

    else if( $stateParams.cityPlant == "Hrast" ){
        $scope.citySelectedPlant = "hrast";
        $scope.citySelectedPlantEng = "hrast";
    }

    else if( $stateParams.cityPlant == "Hrast crnika" ){
        $scope.citySelectedPlant = "hrast crnika";
        $scope.citySelectedPlantEng = "hrast crnika";
    }

    else if( $stateParams.cityPlant == "Jasen" ){
        $scope.citySelectedPlant = "jasen";
        $scope.citySelectedPlantEng = "jasen";
    }

    else if( $stateParams.cityPlant == "Joha" ){
        $scope.citySelectedPlant = "joha";
        $scope.citySelectedPlantEng = "joha";
    }
    else if( $stateParams.cityPlant == "Lijeska" ){
        $scope.citySelectedPlant = "lijeska";
        $scope.citySelectedPlantEng = "lijeska";
    }
    else if( $stateParams.cityPlant == "Lipa" ){
        $scope.citySelectedPlant = "lipa";
        $scope.citySelectedPlantEng = "lipa";
    }
    else if( $stateParams.cityPlant == "Maslina" ){
        $scope.citySelectedPlant = "maslina";
        $scope.citySelectedPlantEng = "maslina";
    }
    else if( $stateParams.cityPlant == "Orah" ){
        $scope.citySelectedPlant = "orah";
        $scope.citySelectedPlantEng = "orah";
    }

    else if( $stateParams.cityPlant == "Platana" ){
        $scope.citySelectedPlant = "platana";
        $scope.citySelectedPlantEng = "platana";
    }

    else if( $stateParams.cityPlant == "Topola" ){
        $scope.citySelectedPlant = "topola";
        $scope.citySelectedPlantEng = "topola";
    }

    else if( $stateParams.cityPlant == "Trave" ){
        $scope.citySelectedPlant = "trave";
        $scope.citySelectedPlantEng = "trave";
    }

    else if( $stateParams.cityPlant == "Koprive" ){
        $scope.citySelectedPlant = "koprive";
        $scope.citySelectedPlantEng = "koprive";
    }

    else if( $stateParams.cityPlant == "Ambrozija" ){
        $scope.citySelectedPlant = "ambrozija";
        $scope.citySelectedPlantEng = "ambrozija";
    }

    else if( $stateParams.cityPlant == "Crkvina" ){
        $scope.citySelectedPlant = "crkvina";
        $scope.citySelectedPlantEng = "crkvina";
    }

    else if( $stateParams.cityPlant == "Kiselica" ){
        $scope.citySelectedPlant = "kiselica";
        $scope.citySelectedPlantEng = "kiselica";
    }

    else if( $stateParams.cityPlant == "Pelin" ){
        $scope.citySelectedPlant = "pelin";
        $scope.citySelectedPlantEng = "pelin";
    }

    else if( $stateParams.cityPlant == "Trputac" ){
        $scope.citySelectedPlant = "trputac";
        $scope.citySelectedPlantEng = "trputac";
    }

    else if( $stateParams.cityPlant == "Loboda" ){
        $scope.citySelectedPlant = "loboda";
        $scope.citySelectedPlantEng = "loboda";
    }

    else if( $stateParams.cityPlant == "weed" ){
        $scope.citySelectedPlant = "weed";
        $scope.citySelectedPlantEng = "weed";
    }
    else if( $stateParams.cityPlant == "Pitomi kesten" ){
        $scope.citySelectedPlant = "pitomi kesten";
        $scope.citySelectedPlantEng = "pitomi kesten";
    }
    else if( $stateParams.cityPlant == "Vrba" ){
        $scope.citySelectedPlant = "vrba";
        $scope.citySelectedPlantEng = "vrba";
    }

    //console.log($scope.citySelected );

    $scope.date = new Date();
    $scope.appDate = $filter('date')($scope.date, "dd.MM.yyyy.");


    ////////////////////////////////////////////////
    ////////////////VREMENSKA API START ///////////
    //////////////////////////////////////////////

    //http://api.openweathermap.org/data/2.5/weather?q=karlovac&mode=json&units=metric&appid=24444200959c97eead79b2c03f891fa7

    $scope.weatherapi = "http://api.openweathermap.org/data/2.5/weather?q=" + $scope.citySelected + "&mode=json&lang=hr&units=metric&appid=24444200959c97eead79b2c03f891fa7";

    $http.get($scope.weatherapi).success(function(response) {

      $scope.weatherData = response;
      console.log($scope.weatherData);
      console.log($scope.weatherapi);

    });

    $scope.weatherapi5days = "http://api.openweathermap.org/data/2.5/forecast?q=" + $scope.citySelected + "&mode=json&lang=hr&units=metric&appid=24444200959c97eead79b2c03f891fa7";

    $http.get($scope.weatherapi5days).success(function(response) {

      $scope.weatherapi5days = response;
      console.log("weatherapi5days");
      console.log($scope.weatherapi5days);

    });


    ///////////////////////////////////////////////
    ////////////////PLIVA API START ////////////////
    ////////////////////////////////////////


    $scope.queryString = "http://www.plivazdravlje.hr/alergije/prognoza/" + $scope.citySelectedID + "/" +
    $scope.citySelected + ".html?xml2";

    //console.log($scope.queryString);
    ///// start
    //http: //www.plivazdravlje.hr/alergije/prognoza/10/Zagreb.html?xml2
    $http.get($scope.queryString).success(function(response) {

        $scope.details = response;

        var x2js2 = new X2JS();
        var xmlText2 = x2js2.parseXmlString(response);

        $scope.jsonObj2 = x2js2.xml2json(xmlText2);
        //  console.log($scope.jsonObj.measure);
      //  console.log($scope.jsonObj2);

      $scope.firstVisible = false;
      $scope.secondVisible = false;


        $scope.listOfCitiParams1 = [];
        $scope.listOfCitiParams2 = [];
        $scope.listOfCitiParams3 = [];
        $scope.listOfCitiParams4 = [];
//console.log($scope.jsonObj2.forecast);

        // ako je biljka poimenicno
        if($scope.jsonObj2.measure){

          $scope.firstVisible = true;
          $scope.secondVisible = false;
          console.log($scope.selectedPlantType);

            angular.forEach($scope.jsonObj2.measure.plant, function(item, redniBroj) {

                if(item.name == $scope.selectedPlantType){

                    $scope.listOfCitiParams1.push({
                      "plantName": item.name,
                      "plantData": item.daily,
                      "plantPhoto": "img/" + item.name + "@3x.png"
                    });
                }
                //console.log($scope.listOfCitiParams[0].plantData.day[0].level.__text);
              });

              console.log("listOfCitiParams1");
              console.log($scope.listOfCitiParams1);

        }

          if($scope.jsonObj2.forecast){

            // ako je drvece korovi

            $scope.firstVisible = false;
            $scope.secondVisible = true;

            angular.forEach($scope.jsonObj2.forecast, function(item, redniBroj) {

            //  console.log(redniBroj);
              if(redniBroj != "_city"){
                if(redniBroj != "_time"){

                  // ako je odabrana boljka od grada koja nas zanima
                  if(redniBroj == $scope.selectedPlantType){

                      $scope.listOfCitiParams2.push({
                        "plantName": redniBroj,
                        "plantData": item.daily,
                        "plantPrevails": item.prevails,
                        "plantPhoto": "img/" + redniBroj + "@3x.png"
                      });

                   }
                 }
                }

                //console.log($scope.listOfCitiParams2[0].plantData.day[2].value["__text"]);
                //console.log($scope.listOfCitiParams[0].plantData.day[0].level.__text);
              });
              console.log("listOfCitiParams2");
                console.log($scope.listOfCitiParams2);

              // prođi kroz novu listu
              for (c = 0; c < $scope.listOfCitiParams2.length; c++) {
                //i pogledaj dali ima plantPrevails
                if($scope.listOfCitiParams2[c].plantPrevails != undefined){
                    //ako ima dodaj u novu listu
                    $scope.listOfCitiParams3.push({
                      "plantPrevails": $scope.listOfCitiParams2[c].plantPrevails.plant
                    });
                }

              //  if($scope.listOfCitiParams2[c].plantPrevails.plant){}
              }
              /// taj objekt moze imati jednu ili vise biljaka onda je potrebno traversati sa 2 uvjeta
              //console.log($scope.listOfCitiParams3);
              // prođi kroz novu listu i pogledaj dali ima jedan rezultat ili vise
              for (d = 0; d < $scope.listOfCitiParams3.length; d++) {
                // ako ima vise od 1 rezultata
                if($scope.listOfCitiParams3[d].plantPrevails.length >= 1){

                  //  console.log($scope.listOfCitiParams3[d].plantPrevails.length);
                    //console.log("ovaj prolazi - kad ga je vise od 1");
                        // skrivanje i pokazivanje templejta za vise clanova
                        $scope.morethanone = true;
                        $scope.onlyone = false;

                        //console.log($scope.listOfCitiParams3[d].plantPrevails.length);
                        // prođi jos jednom kroz listu i ljepo mi slozi novu za ispis
                        for (j = 0; j < $scope.listOfCitiParams3[d].plantPrevails.length; j++) {

                              $scope.listOfCitiParams4.push({
                                "plantID": $scope.listOfCitiParams3[d].plantPrevails[j]._id,
                                "plantName": $scope.listOfCitiParams3[d].plantPrevails[j].__text,
                                "plantPhoto": 'img/' + $scope.listOfCitiParams3[d].plantPhoto+ '@3x.png'
                              });
                        }
                }

                else {
                  // ako ima samo jedan onda ugasi templeljt za vise prikaza i pokazi za 1
                  $scope.morethanone = false;
                  $scope.onlyone = true;

                  //  console.log($scope.listOfCitiParams3[d].plantPrevails);
                  // console.log("ovaj prolazi - kad ga je samo 1");
                   // prođi jos jednom kroz listu i slozi mi tu jednu biljku
                    $scope.listOfCitiParams4.push({
                      "plantID": $scope.listOfCitiParams3[d].plantPrevails._id,
                      "plantName": $scope.listOfCitiParams3[d].plantPrevails.__text,
                      "plantPhoto": 'img/' + $scope.listOfCitiParams3[d].plantPhoto + '@3x.png'
                    });

                }

                  console.log($scope.listOfCitiParams4);

              }

          }

      }).finally(function(response) {

        var myEl = angular.element( document.querySelector('#idGetter'));
        myEl.removeClass('loader');

      })





      $scope.textForCityDown = "";

      if($stateParams.cityParam == "Beli Manastir"){

          $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Osječko-baranjske županije";

      } else if($stateParams.cityParam == "Dubrovnik") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Dubrovačko-neretvanske županije";

      } else if($stateParams.cityParam == "Karlovac") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Karlovačke županije";

      } else if($stateParams.cityParam == "Kutina") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Sisačko-moslavačke županije";

      } else if($stateParams.cityParam == "Metković") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Dubrovačko-neretvanske županije";

      } else if($stateParams.cityParam == "Našice") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Osječko-baranjske županije";

      } else if($stateParams.cityParam == "Osijek") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Osječko-baranjske županije";

      } else if($stateParams.cityParam == "Pula") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Istarske županije";

      } else if($stateParams.cityParam == "Rijeka") {

            $scope.textForCityDown ="Izvor podataka: Nastavni zavod za javno zdravstvo Primorsko-goranske županije";

      } else if($stateParams.cityParam == "Šibenik") {

            $scope.textForCityDown ="";

      }else if($stateParams.cityParam == "Sisak") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Sisačko-moslavačke županije";

      }else if($stateParams.cityParam == "Slavnoski Brod") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Brodsko-posavske županije";

      }else if($stateParams.cityParam == "Split") {

            $scope.textForCityDown ="Izvor podataka: Nastavni zavod za javno zdravstvo Splitsko-dalmatinske županije";

      }else if($stateParams.cityParam == "Varaždin") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Varaždinske županije";

      }else if($stateParams.cityParam == "Virovitica") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo 'Sveti Rok' Virovitičko-podravske županije";

      }else if($stateParams.cityParam == "Zadar") {

            $scope.textForCityDown ="Izvor podataka: Zavod za javno zdravstvo Zadarske županije";

      }else if($stateParams.cityParam == "Zagreb") {

            $scope.textForCityDown ="Izvor podataka: Nastavni zavod za javno zdravstvo 'Dr. Andrija Štampar'";

      }

  })

.controller('Alergene', function($scope, $stateParams) {
    $scope.alergeneLocation = "#/plantDetailed/Trave";
})

.controller('AlergeneDetaljno', function($scope, $stateParams,  $http) {

    $scope.plantSelectedDetailed = $stateParams.plantId;

    $http.get('js/content.json').success(function(data) {

        $scope.details = data;

        console.log(data);

        $scope.listOfPlants = [];

        angular.forEach($scope.details.contentItem, function(item,redniBroj) {

          //console.log(item.herbCategory);
            if ($scope.plantSelectedDetailed == item.herbCategory) {

              $scope.listOfPlants.push({
                "plantName": item.herbTitle,
                "plantImg": item.catImg,
                "plantText": item.mainText,
                "plantImg1": item.img1,
                "plantImg2": item.img2,
                "plantImg3": item.img3,
                "plantAlergentnost":item.stupanjAlergentnosti
              });
            }
        });
        console.log("ovooo");
        console.log($scope.listOfPlants);

      //  console.log($scope.plantSelectedDetailed);

      });


})

.controller('NavCtrl', function($scope, $ionicSideMenuDelegate, $ionicHistory) {

    $scope.showMenu = function() {
      $ionicSideMenuDelegate.toggleRight();
    };

    $scope.showRightMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };


    $scope.clearLocal = function() {

      localStorage.setItem("test", "")

      console.log(localStorage.getItem("test"));



    };


    $scope.myGoBack = function() {
     $ionicHistory.goBack();
   };

  })
  /*
  .controller('HomeController', function($scope, $stateParams) {


  });
  */

.controller('HomeController', function($scope, $http, $location) {

  $scope.localStorageCity = localStorage.getItem("cityName");
  $scope.localStorageCityId = localStorage.getItem("cityId");
  console.log("cityName");
  console.log($scope.localStorageCity);
  console.log("cityId");
  console.log($scope.localStorageCityId);


  // AKO IMA GRAD SEJVAN
   if($scope.localStorageCity != "" && $scope.localStorageCity != "undefined" && $scope.localStorageCity != null) {


   if($scope.localStorageCityId != "" && $scope.localStorageCityId != "undefined" && $scope.localStorageCityId != null) {

         $location.path("/chosenCity/" + $scope.localStorageCity + "/" + $scope.localStorageCityId);

}

}

});
