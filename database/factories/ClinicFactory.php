<?php

use Faker\Generator as Faker;

$factory->define(App\Clinic::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'phone' => $faker->tollFreePhoneNumber,
        'address' => $faker->address,
        'description' => $faker->text,
        'clinic_type_id' => App\ClinicType::pluck('id')->random()
    ];
});