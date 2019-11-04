Feature: I check about page

Background:
    Given I am alredy sign-out

Scenario Outline: I test about page
    Given I visit about page
    Then I see the "<aboutComponent>"

Examples:
    | aboutComponent | 
    | app-about      |   