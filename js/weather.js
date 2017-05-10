function Weather() {
	$.getJSON('http://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1&mode=json&units=metric', function (data) {

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


	});
}

Weather();