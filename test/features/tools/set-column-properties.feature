Feature: Set Column Properties
  As a Data Packager  
  I want to describe the meaning and structure of the data  
  So that it can be validated and Data Consumers can understand and use it  

  RULES
  =====

  - Column properties are defined in http://frictionlessdata.io/specs/table-schema/
  - The `name`, `type` and `format` can be pre-populated using Guess Column Properties
  - A `name` must be entered for each column. `name` will be defaulted from the value in the first row
  - The `title` and `description` are optional
  - Each `type` has a `format` of `default` and may have a limited set of other formats
  - Data of a certain `type` may have extra properties e.g. `groupChar` for `number`
  - Each column may have one or more `constraints` to further restrict the valid values that can be entered into a column. Constraints can vary by `type`
  - "Set Column Properties" for the current column can be invoked from the menu, toolbar or shortcut
  
  LATER
  =====
  
  - `missingValues` can be set per column 

  Background:
    Given Data Curator is open
    And the cursor is in a data tab

  Scenario: Set Column Properties for the current column
    When "Column Properties" is invoked
    Then a panel that allows properties for the current column to be set should be displayed
    And column property values should be accepted and validated 
    And the values should be saved as they are entered
