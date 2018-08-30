<div id="results">
  <div class="container">
    <div class="row">
      <div class="col-md-6" id="js_count">
        <h4><strong>{{ __('user/result.show') }} <span></span> {{ __('user/result.to') }} <span></span> {{ __('user/result.of') }} <span></span> {{ __('user/result.results') }}</strong></h4>
      </div>
      @if (request()->is('clinics'))
        <div class="col-md-6">
          <div class="search_bar_list">
            <input type="text" class="form-control" name="search" placeholder="{{ __('user/result.placehoder') }}">
            <input type="submit" value="Search">
          </div>
        </div>
      @endif
    </div>
    <!-- /row -->
  </div>
  <!-- /container -->
</div>
