/**
 * Help class which contains static methods
 */
class DataControlUtils {

    /**
   * for linebreak in poup text we use '<br>' tag
   */
  public static convertDescToPopText = (descText: string): string => {
    if (!descText) return "";
    return descText.replaceAll("\n", "<br />");
  };

  /**
   * for linebreak in field we use '\n' character
   */
  public static convertDescfromPopText = (popText: string): string => {
    if (!popText) return "";
    return popText.replaceAll("<br />", "\n");
  };

}
export default DataControlUtils;