var json_result = {"cod":"200","message":0,"city":{"geoname_id":524901,"name":"Moscow","lat":55.7522,"lon":37.6156,"country":"RU","iso2":"RU","type":"city","population":0},"cnt":7,"list":[{"dt":1485766800,"temp":{"day":262.65,"min":261.41,"max":262.65,"night":261.41,"eve":262.65,"morn":262.65},"pressure":1024.53,"humidity":76,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":4.57,"deg":225,"clouds":0,"snow":0.01},{"dt":1485853200,"temp":{"day":262.31,"min":260.98,"max":265.44,"night":265.44,"eve":264.18,"morn":261.46},"pressure":1018.1,"humidity":91,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":4.1,"deg":249,"clouds":88,"snow":1.44},{"dt":1485939600,"temp":{"day":270.27,"min":266.9,"max":270.59,"night":268.06,"eve":269.66,"morn":266.9},"pressure":1010.85,"humidity":92,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":4.53,"deg":298,"clouds":64,"snow":0.92},{"dt":1486026000,"temp":{"day":263.46,"min":255.19,"max":264.02,"night":255.59,"eve":259.68,"morn":263.38},"pressure":1019.32,"humidity":84,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":3.06,"deg":344,"clouds":0},{"dt":1486112400,"temp":{"day":265.69,"min":256.55,"max":266,"night":256.55,"eve":260.09,"morn":266},"pressure":1012.2,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":7.35,"deg":24,"clouds":45,"snow":0.21},{"dt":1486198800,"temp":{"day":259.95,"min":254.73,"max":259.95,"night":257.13,"eve":254.73,"morn":257.02},"pressure":1029.5,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":2.6,"deg":331,"clouds":29},{"dt":1486285200,"temp":{"day":263.13,"min":259.11,"max":263.13,"night":262.01,"eve":261.32,"morn":259.11},"pressure":1023.21,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":5.33,"deg":234,"clouds":46,"snow":0.04}]};

function Weather() {
	var data = json_result;
	//$.getJSON('http://samples.openweathermap.org/data/2.5/forecast/daily?id=524901&lang=zh_cn&appid=b1b15e88fa797225412429c1c50c122a1', function (data) {

		var list = [];
		var selectedDate = new Date();

		var formatDateYYMMDD = function (unixMilliseconds) {
			return new Date(unixMilliseconds).toISOString().slice(0, 10);
		};
		var formatDate_hhmm = function (unixMilliseconds) {
			return new Date(unixMilliseconds).toISOString().slice(11, 16);
		};
		var mathRound = function(item) {
			return +((item).toFixed(1));
		};

		_.each(data.list, function (item) {
			var ymd = formatDateYYMMDD(item.dt * 1000);
			var hhmm = formatDate_hhmm(item.dt * 1000);
			var weather = item.weather && item.weather.length > 0 ? item.weather[0] : null;

			list.push({
				dt_txt: hhmm,
				ymd: ymd,
				clouds: item.clouds.all,
				temp: mathRound(item.main.temp),
				weather: weather ? {desc: weather.description, text: weather.main, icon: weather.icon} : null,
				windDeg: Math.round(item.wind.deg),
				windSpeed: mathRound(item.wind.speed)
			});
		});

		initWeather();

		//click
		$(document).on('click', '.navigation', function (e) {
			initWeather();
		});

		function initFilter(list, currentDate, tomorrowDate) {
			view = _.filter(list, function (item) {
				return item.ymd >= currentDate && item.ymd < tomorrowDate;
			});
		}

		//template
		function initView(yesterdayDate, tomorrowDate) {
			var tmplText = $('#list').html();
			var tmpl = _.template(tmplText);

			var renderedTemplate = tmpl({
				col: Math.round(12 / view.length),
				city: data.city.name,
				lon: data.city.coord.lon,
				lat: data.city.coord.lat,
				items: view,
				selectedDate: formatDateYYMMDD(selectedDate)
			});

			$('#page').html(renderedTemplate);
			$('#next').attr('href', '?date=' + tomorrowDate);
		}

		//public
		function initWeather() {
			selectedDate = getDate();
			var yesterdayDate = yesterdayYmd(selectedDate);
			var tomorrowDate = tomorrowYmd(selectedDate);
			var currentDate = formatDateYYMMDD(selectedDate).toString();

			initFilter(list, currentDate, tomorrowDate);
			initView(yesterdayDate, tomorrowDate);
		}

		//dateParam
		function getDate() {
			var param = window.location.search.replace('?date=', '');
			return param && param.length > 0 ? new Date(param) : new Date();
		}

		//yesterday
		function yesterdayYmd(selectedDate) {
			var yesterday = new Date(selectedDate);
			yesterday.setDate(yesterday.getDate() - 1);
			return formatDateYYMMDD(yesterday);
		}

		//tomorrow
		function tomorrowYmd(selectedDate) {
			var tomorrow = new Date(selectedDate);
			tomorrow.setDate(tomorrow.getDate() + 1);
			return formatDateYYMMDD(tomorrow);
		}


	//});
}

Weather();