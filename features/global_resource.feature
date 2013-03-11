Feature: Global Resources
  In order to distribute our global resources and make it easy to maintain
  As the lp global service
  I should be able to serve the global-head, body-header and global-footer snippets
  
  Scenario: it serves the global-head
    Given I go to "/global-head"
    Then the global-head should have the correct content
  
  Scenario: it serves the secure global header
    Given I go to "/secure/global-head"
    Then the global-head should have the correct content

  Scenario: it serves the noscript global header
    Given I go to "/noscript/global-head"
    Then the noscript global-head should have the correct content

  Scenario: it serves the global-body-header
    Given I go to "/global-body-header"
    Then the global-body-header response should have the correct content
  
  Scenario: it serves the secure-global-header
    Given I go to "/secure/global-body-header"
    Then the secure global-body-header response should have the correct content
  
  Scenario: it serves the global-body-footer
    Given I go to "/global-body-footer"
    Then the global-body-footer should response have the correct content
  
  Scenario: it serves the secure-global-footer
    Given I go to "/secure/global-body-footer"
    Then the secure global-body-footer response should have the correct content

  Scenario: it serves the noscript global footer
    Given I go to "/noscript/global-body-footer"
    Then the secure noscript body-footer response should have the correct content

  Scenario: it serves the global-header without user navigation box
    Given I go to "/secure/global-body-header?displaySignonWidget=false"
    Then the global-body-header response should not have the user nav box
  
  Scenario: it serves the global-head with errbit script
    Given an external app
    When it requests the "global-head" snippet
    Then the response should contain the "errbit" script

  Scenario: it serves the global-head without errbit script
    Given an external app
    When it requests the "global-head?errbit=false" snippet
    Then the response should not contain the "errbit" script
