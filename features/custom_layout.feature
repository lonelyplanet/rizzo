Feature: Custom Layouts
  In order to expose Rizzo to a variety of consumers
  As a flexible platform
  I should be able to customize layouts for each route

  Scenario: it serves the default preview file
    Given I go to "/layouts/anything"
    Then the Preview route should be displayed
    And the body should have a class of responsive

  Scenario: it serves the default preview file for India
    Given I go to "/layouts/india"
    Then the Preview route should be displayed
    And the body should have a class of responsive
    And user nav should not be present
    And search should not be present
    And sitemap nav should not be present
    And about nav should not be present
    And the header ad should be present
    And the tynt tag should not be displayed

  Scenario: it serves the default preview file
    Given I go to "/layouts/responsive"
    Then the Preview route should be displayed
    And the body should have a class of responsive

  Scenario: it serves the default preview file
    Given I go to "/layouts/fixed-width"
    Then the Preview route should be displayed
    And it should load the fixed width version

  Scenario: it serves the default preview file
    Given I go to "/layouts/minimal"
    Then the Preview route should be displayed
