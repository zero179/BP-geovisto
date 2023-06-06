/**
 * Help class which contains static methods
 */
declare class DataControlUtils {
    /**
   * for linebreak in poup text we use '<br>' tag
   */
    static convertDescToPopText: (descText: string) => string;
    /**
     * for linebreak in field we use '\n' character
     */
    static convertDescfromPopText: (popText: string) => string;
}
export default DataControlUtils;
