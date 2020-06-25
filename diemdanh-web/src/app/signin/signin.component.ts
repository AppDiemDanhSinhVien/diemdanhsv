import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
declare var $: any;
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  email = '';
  password = '';
  loadingLogin = false;
  loginFail = false;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', (e) => {
      e.preventDefault();

      var check = true;

      for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
          showValidate(input[i]);
          check = false;
        }
      }

      if (check) {
        this.loadingLogin = true;
        this.auth.sendToken(this.email, this.password).then((result: any) => {
          if (result.logged == true) this.router.navigate(['/']);
        }).finally(() => this.loadingLogin = false)
          .catch(err => {
            $('#thongbaoLoginFailed').show();
          })
      }

    });


    $('.validate-form .input100').each(function () {
      $(this).focus(function () {
        hideValidate(this);
      });
    });

    function validate(input) {
      if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          return false;
        }
      }
      else {
        if ($(input).val().trim() == '') {
          return false;
        }
      }
    }

    function showValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
      var thisAlert = $(input).parent();
      $('#thongbaoLoginFailed').hide();
      $(thisAlert).removeClass('alert-validate');
    }

  }

}
