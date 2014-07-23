Feature: Global Resources
  In order to distribute our global resources and make it easy to maintain
  As the lp global service
  I should be able to serve the global-head, body-header and global-footer snippets

  Scenario: it serves the legacy header and footer
    Given I go to "/legacy"
    Then the Legacy layout should be displayed
    
  Scenario: it serves the global-head
    Given I go to "/global-head"
    Then the base global-head content should be displayed
    And the non-secure global-head content should be displayed
    And the tynt tag should be displayed

  Scenario: it serves the secure global head
    Given I go to "/secure/global-head"
    Then the base global-head content should be displayed
    And the secure global-head content should be displayed
    And the global-head should serve a secure static-ui stylesheet
    And the global-head should serve a secure static-ui script
    And the tynt tag should not be displayed

  Scenario: it serves the noscript global head
    Given I go to "/noscript/global-head"
    Then the noscript global-head should have the correct content
    And the global-head should serve a secure static-ui stylesheet
    And the tynt tag should not be displayed

  Scenario: it serves the client solutions global head
    Given I go to "/client-solutions/global-head"
    Then the client-solutions global-head should have the correct content

  Scenario: it serves the global-body-header
    Given I go to "/global-body-header"
    Then the global-body-header response should have the correct content

  Scenario: it serves the secure-global-header
    Given I go to "/secure/global-body-header"
    Then the secure global-body-header response should have the correct content

  Scenario: it serves the client-solutions global-header
    Given I go to "/client-solutions/global-body-header"
    Then the client-solutions global-body-header response should have the correct content

  Scenario: it serves the global-body-footer
    Given I go to "/global-body-footer"
    Then the global-body-footer should response have the correct content

  Scenario: it serves the secure-global-footer
    Given I go to "/secure/global-body-footer"
    Then the secure global-body-footer response should have the correct content

  Scenario: it serves the noscript global footer
    Given I go to "/noscript/global-body-footer"
    Then the secure noscript body-footer response should have the correct content

  Scenario: it serves the client solutions global footer
    Given I go to "/client-solutions/global-body-footer"
    Then the client-solutions body-footer response should have the correct content

  Scenario: it serves the global-header without user navigation box
    Given I go to "/secure/global-body-header?displaySignonWidget=false"
    Then the global-body-header response should not have the user nav box
